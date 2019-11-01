const MIDIController = require('./MIDI/MIDIController');
const MIDIRecorder = require('./MIDI/MIDIRecorder');
const OSMD = require('./OSMD/index');
const Note = require('./Utils/Note');
const {Composition, Part, Measure} = require('./MusicXML/Composition');

window.Note = Note;
window.Composition = Composition;
window.Part = Part;

var Measure1 = new Measure(1);
var Measure2 = new Measure(2);

Measure1
    .addNote( (new Note()).setDuration(12).setStep("C").setOctave(4) )
    .addNote( (new Note()).setDuration(12).setStep("D").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("E").setOctave(4) )
    .addNote( (new Note()).setDuration(12).setStep("G").setOctave(4) )
    .addNote( (new Note()).setDuration(12).setStep("E").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("F").setOctave(4) );
Measure2
    .addNote( (new Note()).setDuration(24).setStep("G").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("A").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("Bb").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("B").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("B#").setOctave(4) )
    .addNote( (new Note()).setDuration(24).setStep("C").setOctave(5) );

var Part1 = new Part("Piano von Lukas");
Part1
    .addMeasure( Measure1 )
    .addMeasure( Measure2 );

var theMusic = new Composition();
theMusic.addPart(Part1);    

OSMD.renderMusicXML( theMusic.toMusicXML() );

setTimeout(() => {
    theMusic.setTitle("Any Title of the World!");
    OSMD.renderMusicXML( theMusic.toMusicXML() );
}, 2000);

//console.log( theMusic.toMusicXML() );

//theMusic.download();



/*
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

