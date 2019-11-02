const Note = require('../Utils/Note');

class MIDIRecorder{


    constructor(){
        this._DEBUG = true;
        this._output = null;

        this._recordedNotes = [];
        this._recordedPedalEvents = [];
    }

    get recordedNotes(){ return this._recordedNotes; }

    registerOutput(output){
        this._output = output;
    }

    noteOnEvent( event ){
        var note = (new Note())
            .setStep( event.note.name )
            .setOctave( event.note.octave)
            .setTimestampStart( event.timestamp)
            .setVelocity( event.velocity );

        this._recordedNotes.push(
            note
        );
    }

    noteOffEvent( event ){
        var offNote = new Note()
            .setStep( event.note.name )
            .setOctave( event.note.octave)
            .setTimestampStart( event.note.octave)
        
        var notEndedNotes = this._recordedNotes.filter( (note) => {
            return !note.hasEnded();
        });

        for(var i = 0; i < notEndedNotes.length; i++){
            if( Note.equals(offNote, notEndedNotes[i]) ){
                notEndedNotes[i].setTimestampEnd( event.timestamp );
                break;
            }
        }
    }

    pedalEvent(event){
        throw "Pedal Event not implemented jet!";
        this.recordedPedalEvents.push( event );
    }

    clearRecord(){
        this._recordedNotes = [];
    }

    _setNotesToT0(){
        var minTimestamp = this._recordedNotes[0].timestampStart;

        this._recordedNotes.forEach( (note) => {
            note
            .setTimestampStart( (note.timestampStart - minTimestamp) )
            .setTimestampEnd( (note.timestampEnd - minTimestamp) );
            
        });


        /*this.recordedPedalEvents.forEach( (event) => {
            event.timestamp = (event.timestamp - minTimestamp);
        })*/
    }

    _playNote(note){
        if(!this._output)throw "No Output is registered!";
        this._output.playNote( [ (note.step + note.octave) ], 1, {duration: note.durationTimestamp, velocity: note.velocity, release: 0}); // note.duration
    }

    playRecord(){
        if(this._recordedNotes.length <= 0)return;
    

        this._setNotesToT0();

        /*this.recordedPedalEvents.forEach( (event) => {
            setTimeout(() => {
                this._output.sendControlChange( event.controller.name, event.value);
            }, event.timeout);
        })*/

        var tick = 0;
        var interval = 5;
        var clockInterval = setInterval(() => {
            tick++;
        
            if(this._recordedNotes.length <= 1)clearInterval(clockInterval);
        
            try{
                var note = this._recordedNotes[0];
                
                var timeout = (note.timestampStart - (tick * interval));

                setTimeout( () =>{ this._playNote(note);}, timeout);

                this._recordedNotes.splice(0,1);
            }catch(e){
                console.log("ERROR IN NEXT LINE", e);
                clearInterval(this.clockInterval);
            }
        }, interval);
    }
    
}

module.exports = MIDIRecorder;