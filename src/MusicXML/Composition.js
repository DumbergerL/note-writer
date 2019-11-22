const xmlConverter = require('xml-js');
const MusicXMLParser = require('./MusicXMLParser');
const Part = require('./CompositionElements/Part');
const Measure = require('./CompositionElements/Measure');

class Composition extends MusicXMLParser{

    constructor(){
        super();
        this._partList = [];
        this._title = "Default";
    }

    addPart(part){ 
        if(!(part instanceof Part))throw "Parameter must be instance of Part";
        this._partList.push(part); 
        return this;
    }
    setTitle(title){ 
        this._title = title; 
        return this; 
    }


    toMusicXMLinJSON(){
        const JSON = {
            _declaration: {
                _attributes: {
                    version: "1.0",
                    encoding: "UTF-8"
                }
            },
            _doctype: "score-partwise PUBLIC \"-//Recordare//DTD MusicXML 3.1 Partwise//EN\" \"http://www.musicxml.org/dtds/partwise.dtd\"",
            'score-partwise': {
                _attributes: { version: "3.1"},
                'part-list': {
                    'score-part': []
                },

                'part': []
            }
        };

        if(this._title !== null)JSON['score-partwise']['work'] = {'work-title': {'_text': this._title}};

        this._partList.forEach( part => {
            JSON['score-partwise']['part-list']['score-part'].push( part.toMusicXMLPartListinJSON()['score-part'] );
            JSON['score-partwise']['part'].push( part.toMusicXMLinJSON().part );
        })
        return JSON;
    }

    download(downloadName = "composition"){
        var dataStr = "data:musicxml;charset=utf-8," + encodeURIComponent( this.toMusicXML() );
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", downloadName+".musicxml");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

}

module.exports = {Composition, Part, Measure};