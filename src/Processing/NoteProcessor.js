const BPM = require('../Utils/BPM');
const OSMD = require('../OSMD/index');
const {Composition, Part, Measure} = require('../MusicXML/Composition');


class NoteProcessor{

    constructor(){
        this._notes = [];
        this._composition = new Composition();
        this._composition.addPart( new Part('P1').setName('Piano'));
    }

    pushNote(note){
        this._notes.push(note);
        this.processNoteDuration();
    }

    processNoteDuration(){
        if(this._notes.length > 1){
            let note1 = this._notes[ this._notes.length - 2];
            let note2 = this._notes[ this._notes.length - 1];
            
            var duration = BPM.GET_DURATION_C80140(note1.timestampStart, note2.timestampStart)
            note1.setDuration( (duration !== null ? duration : 16)  );
    
            console.log(note1);
            //this._composition._partList[0].addNote( note1 ); 
            //OSMD.renderMusicXML( this._composition.toMusicXML() );
        }
    }
}

module.exports = NoteProcessor;