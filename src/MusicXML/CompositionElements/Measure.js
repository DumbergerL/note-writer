const MusicXMLParser = require('../MusicXMLParser');

class Measure extends MusicXMLParser{
    constructor(measureNumber){
        super();
        if(measureNumber === undefined || !Number.isInteger(measureNumber)) throw "Measure Number must be set as int in constructor!";

        this._number = measureNumber;
        this._attributes = Measure.DEFAULT_ATTRIBUTES;
        this._notes = [];
    }

    get number(){ return this._number; }
    get notes(){ return this._notes; }

    get measureDuration(){ 
        let duration = 0;
        this.notes.forEach( note => {
            duration += note.duration;
        });
        return duration;
    }

    addNote(note){ this._notes.push(note); return this; }
    setAttributes(attributes){ this._attributes = attributes; return this; }

    toMusicXMLinJSON(){
        const JSON = { 
            'measure': {
                '_attributes': {
                    number: this.number,
                },
            }
        };

        if(this._number === 1){
            JSON.measure.attributes = this._attributes;
        }

        JSON.measure.note = [];
        this.notes.forEach( note => {
            JSON.measure.note.push( note.toMusicXMLinJSON().note );
        });

        return JSON;
    }
}

Measure.DEFAULT_ATTRIBUTES = {
    divisions: { _text: 24, },
    key: { fifths: { _text: 0 }},
    time: { 
        beats: { _text: 4 }, 
        'beat-type': { _text: 4 }
    },
    clef: {
        sign: { _text: 'G' },
        line: { _text: 2}
    }
}

module.exports = Measure;
