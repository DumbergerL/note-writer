const Note = require('../Utils/Note');

class MIDIRecorder{


    constructor(){
        this.DEBUG = true;
        this.output = null;

        this.recordedNotes = [];
        this.recordedPedalEvents = [];
    }

    registerOutput(output){
        this.output = output;
    }

    noteOnEvent( event ){
        var note = new Note(event.note.name, event.note.octave, event.timestamp);
        note.velocity = event.velocity;
        this.recordedNotes.push(
            note
        );
    }

    noteOffEvent( event ){
        var offNote = new Note(event.note.name, event.note.octave, event.timestamp);

        var notEndedNotes = this.recordedNotes.filter( (note) => {
            return !note.hasEnded();
        });

        for(var i = 0; i < notEndedNotes.length; i++){
            if( Note.equals(offNote, notEndedNotes[i]) ){
                notEndedNotes[i].setOffNoteTimestamp( event.timestamp );
                break;
            }
        }
    }

    pedalEvent(event){
        throw "Pedal Event not implemented jet!";
        this.recordedPedalEvents.push( event );
    }

    clearRecord(){
        this.recordedNotes = [];
    }

    _setNotesToT0(){
        var minTimestamp = this.recordedNotes[0].timestamp;

        this.recordedNotes.forEach( (note) => {
            note.timestamp = (note.timestamp - minTimestamp);
        });


        /*this.recordedPedalEvents.forEach( (event) => {
            event.timestamp = (event.timestamp - minTimestamp);
        })*/
    }

    _playNote(note){
        if(!this.output)throw "No Output is registered!";
        this.output.playNote( [ note.toString() ], 1, {duration: note.duration, velocity: note.velocity, release: 0}); // note.duration
    }

    playRecord(){
        if(this.recordedNotes.length <= 0)return;

        this._setNotesToT0();

        /*this.recordedPedalEvents.forEach( (event) => {
            setTimeout(() => {
                this.output.sendControlChange( event.controller.name, event.value);
            }, event.timeout);
        })*/

        var tick = 0;
        var interval = 5;
        var clockInterval = setInterval(() => {
            tick++;
        
            if(this.recordedNotes.length <= 1)clearInterval(clockInterval);
        
            try{
                var note = this.recordedNotes[0];
                
                var timeout = (note.timestamp - (tick * interval));

                setTimeout( () =>{ this._playNote(note);}, timeout);

                this.recordedNotes.splice(0,1);
            }catch(e){
                console.log("ERROR IN NEXT LINE", e);
                clearInterval(this.clockInterval);
            }
        }, interval);
    }
    
}

module.exports = MIDIRecorder;