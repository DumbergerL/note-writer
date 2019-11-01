const $ = require('jquery');
const MIDIController = require('../MIDI/MIDIController');
const MIDIRecorder = require('../MIDI/MIDIRecorder');

var DigitalPiano = new MIDIController();
var Recorder = new MIDIRecorder();

$(function(){
    $("selectedDevice").text(DigitalPiano.controllerName);
    $("selectedChanel").text("NA");
});


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
}); 

