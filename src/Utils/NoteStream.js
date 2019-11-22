const Note = require('./Note');
const MidiController = require('../MIDI/MIDIController');

class NoteStream{

    constructor(midiController){
        if(!(midiController instanceof MidiController))throw "Parameter must be a instance of MidiController!";
        this._midiController = midiController;

        this._midiController.initController().then( () => {
            this._midiController.onNoteOn( (event) => {
                this._onNote(event);
            });

            this._midiController.onNoteOff( (event) => {
                this._offNote(event);
            });
        });


        this._startedNotes = [];
        this._callbacks = [];
    }

    registerCallback( callback ){
        if(typeof callback !== "function")throw "Parameter must be function!";
        this._callbacks.push(callback);
    }

    _onNote(event){
        this._startedNotes.push(
            new Note()
                .setStep( event.note.name )
                .setOctave( event.note.octave )
                .setTimestampStart( event.timestamp )
                .setVelocity( event.velocity )
        );
    }

    _offNote(event){
        const refNote = new Note()
            .setStep( event.note.name )
            .setOctave( event.note.octave );

        for(let i = 0; i < this._startedNotes.length; i++){
            if(Note.equals(this._startedNotes[i], refNote)){
                const offNote = this._startedNotes.splice(i, 1)[0];
                offNote.setTimestampEnd( event.timestamp );
                this._sendNote( offNote );
                break;
            }
        }
    }

    _sendNote( note ){
        this._callbacks.forEach( callback => {
            callback(note);
        });
    }
}

module.exports = NoteStream;