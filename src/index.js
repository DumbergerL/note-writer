const MIDIController = require('./MIDI/MIDIController');
const MIDIRecorder = require('./MIDI/MIDIRecorder');
const Note = require('./Utils/Note');

window.Note = Note;

window.x = (new Note()).setStep('E').setAlter(-1).setOctave(5).setDuration(24);

var DigitalPiano = new MIDIController();
var Recorder = new MIDIRecorder();


DigitalPiano.initController().then( () => {

    Recorder.registerOutput( DigitalPiano.output );

    DigitalPiano.onNoteOn( (event) => {
        switch (event.note.number) {
            case 21:
                Recorder.playRecord();
                break;
            case 23:
                Recorder.clearRecord();
                break;
            default:
                Recorder.noteOnEvent(event);
                break;
        }

    });
    DigitalPiano.onNoteOff( (event) => {
        Recorder.noteOffEvent(event);
    });
}); /**/

