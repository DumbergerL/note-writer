const MusicXMLParser = require('../MusicXMLParser');
const Measure = require('../CompositionElements/Measure');

class Part extends MusicXMLParser{
    constructor(partID){
        super();
        if(partID === undefined)throw "Part ID is not allowd to be undefined!";
        this._id = partID;
        this._name = partID;
        this._measures = [];
    }

    get name(){ return this._name; }
    get id(){ return this._id; }

    setName(name){ this._name = name; return this; }
    addMeasure(measure){ this._measures.push(measure); return this; }
    addNote(note){
        var latestMeasure = this._measures[this._measures.length - 1];
        if(latestMeasure === undefined || latestMeasure.measureDuration >= 96){
            this.addMeasure( new Measure( this._measures.length+1 ));    
            latestMeasure = this._measures[this._measures.length - 1];
        }

        latestMeasure.addNote( note );
        return this;
    }

    toMusicXMLPartListinJSON(){
        const partJSON = { 
            'score-part': {
                '_attributes': {
                    id: this.id,
                }
            }
        };

        if(this.name !== null)partJSON['score-part']['part-name'] = this.name;
        
        return partJSON;    
    }

    toMusicXMLinJSON(){
        const JSON = {
            'part': {
                '_attributes': {
                    id: this.id
                },
            }
        };

        JSON.part.measure = [];
        this._measures.forEach( measure => {
            JSON.part.measure.push( measure.toMusicXMLinJSON().measure );
        });

        return JSON;
    }
}

module.exports = Part;