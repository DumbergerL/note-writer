const NoteStream = require('../Utils/NoteStream');
const MidiController = require('../MIDI/MIDIController');

var noteStream = new NoteStream(new MidiController());

test('instance and base attributes', () => {
    expect(noteStream).toBeInstanceOf( NoteStream );

    expect( noteStream.hasOwnProperty('_midiController') ).toEqual( true );
    expect( noteStream.hasOwnProperty('_startedNotes') ).toEqual( true ); 
    expect( noteStream.hasOwnProperty('_callbacks') ).toEqual( true );  
});

test('constructor parameter must be instance of MidiController', () => {
    expect( new NoteStream( new MidiController())).toBeInstanceOf( NoteStream );

    expect(() => { new NoteStream() }).toThrow();
    expect(() => { new NoteStream("string text") }).toThrow(); 
});

test('setter (setActive, setInactive) responds with instance', () => {
    expect( noteStream.setInactive() ).toBeInstanceOf( NoteStream );
    expect( noteStream.setActive() ).toBeInstanceOf( NoteStream );
});

test('_sendNote returns nothing, when NoteStream is inactive.', () => {
    noteStream.setInactive();
    expect( noteStream._sendNote()).toBe(undefined);
    noteStream.setActive();
});

test('registerCallback to excpect function', () => {
    expect( noteStream.registerCallback( () => {})).toBeInstanceOf( NoteStream );
    expect(() => { noteStream.registerCallback() }).toThrow();
    expect(() => { noteStream.registerCallback("String") }).toThrow();
    expect(() => { noteStream.registerCallback(2) }).toThrow();   
});

test('onNote and offNote expect wellformed event', () => {
    let exampleEvent = {
        note: {
            name: 'C',
            octave: 4,
        },
        timestamp: 295125.1250,
        velocity: 0.92
    };

    expect(() => { noteStream._onNote() }).toThrow();
    expect( noteStream._onNote( exampleEvent ) ).toEqual( undefined );
    exampleEvent.note.name = 'D';
    expect( noteStream._onNote( exampleEvent ) ).toEqual( undefined );
    exampleEvent.note.name = 'E';
    expect( noteStream._onNote( exampleEvent ) ).toEqual( undefined );
    
    exampleEvent.timestamp = 505125.1630;
    expect(() => { noteStream._offNote() }).toThrow();
    expect( noteStream._offNote( exampleEvent ) ).toEqual( undefined );   
    expect( noteStream._offNote( exampleEvent ) ).toEqual( undefined );   
});