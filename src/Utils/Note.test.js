const Note = require('./Note');

var noteInstance = new Note();

//console.log("DUMP", noteInstance.toMusicXML());

test('note is instance of note', () => {
    expect( noteInstance ).toBeInstanceOf(Note);
}); 

test('note extends MusicXMLParser', () => {
    expect( typeof noteInstance.toMusicXML === 'function').toBeTruthy();
});

test('empty note throws error when try to parse musicXML', () => {
    expect( () => { noteInstance.toMusicXML() }).toThrow();
});

test('setter (alter, duration, octave, timestampStart, timestampEnd, velocity) return note instance', () => {
    expect( noteInstance.setAlter(0) ).toBeInstanceOf(Note);
    expect( noteInstance.setDuration(8) ).toBeInstanceOf(Note);
    expect( noteInstance.setOctave(4) ).toBeInstanceOf(Note);
    expect( noteInstance.setStep('C') ).toBeInstanceOf(Note);
    expect( noteInstance.setTimestampEnd(20) ).toBeInstanceOf(Note);
    expect( noteInstance.setTimestampStart(10) ).toBeInstanceOf(Note);
    expect( noteInstance.setVelocity(20) ).toBeInstanceOf(Note);
});

test('getter (step, octave, alter, duration, timestampStart/End, velocity) respond with private attribute', () => {
    expect( noteInstance.step ).toEqual( noteInstance._step );
    expect( noteInstance.octave ).toEqual( noteInstance._octave );
    expect( noteInstance.alter ).toEqual( noteInstance._alter );
    expect( noteInstance.duration ).toEqual( noteInstance._duration );
    expect( noteInstance.timestampStart ).toEqual( noteInstance._timestampStart );
    expect( noteInstance.timestampEnd ).toEqual( noteInstance._timestampEnd );
    expect( noteInstance.velocity ).toEqual( noteInstance._velocity );
});

test('type getter response right type', () => {
    noteInstance.setDuration(48);
    expect( noteInstance.type ).toEqual( 'half' );

    noteInstance.setDuration(3);
    expect( noteInstance.type ).toEqual( '32nd' );

    noteInstance.setDuration(13);
    expect( noteInstance.type ).toEqual( null );
});

test('Timestamp duration and note has ended', () => {
    let note = new Note();

    expect( note.hasEnded() ).toEqual( false );

    note.setTimestampStart(10).setTimestampEnd(20);
    expect( note.durationTimestamp ).toEqual( 10 );
});


test('note to be a rest', () => {
    let rest = new Note();
    rest.setDuration(24);   //NOTE IS REST
    expect( rest.isRest ).toEqual( true );
  
                            //NOTE IS NO REST
    rest.setOctave(4).setStep('C');
    expect( rest.isRest ).toEqual( false );

    
});

test('Invalid step', () => {
    let stepNote = new Note();

    expect( stepNote.setStep('C#') ).toBeInstanceOf( Note );
    expect( stepNote.setStep('Cb') ).toBeInstanceOf( Note );
    expect( stepNote.setStep('D') ).toBeInstanceOf( Note );
    expect(() => { stepNote.setStep(2) }).toThrow();    
    expect(() => { stepNote.setStep("Q") }).toThrow();    
});

test('Invalic octave, alter and duration', () => {
    let note = new Note();

    expect(() => { note.setOctave(-1) }).toThrow();
    expect(() => { note.setOctave("Brot") }).toThrow();
    expect( note.setOctave(3) ).toBeInstanceOf( Note );
    
    expect(() => { note.setAlter(-3) }).toThrow();
    expect(() => { note.setAlter(3) }).toThrow();
    expect(() => { note.setAlter("Brot") }).toThrow();
    expect( note.setAlter(1) ).toBeInstanceOf( Note );
        
    expect(() => { note.setDuration(-1) }).toThrow();
    expect(() => { note.setDuration("Brot") }).toThrow();
    expect( note.setDuration(12) ).toBeInstanceOf( Note );
});

test('to string method', () => {
    let note = new Note();
    note.setOctave(4).setStep('C');
    expect( note.toString() ).toEqual( 'C4' );
});

test('toMusixXMLinJSON method', () => {
    let note = new Note();
    note.setDuration(24);   //NOTE IS REST
    expect( note.toMusicXMLinJSON().note ).toEqual( expect.objectContaining({ rest: {} }));
  
    note.setOctave(4).setStep('C');
    expect( note.toMusicXMLinJSON().note ).toEqual( expect.objectContaining({ pitch: expect.anything() }));
    
    note.setAlter(-1);
    expect( note.toMusicXMLinJSON().note.pitch ).toEqual( expect.objectContaining({ alter: expect.anything() }));
});

test('Note equality', () => {
    let note1 = new Note().setOctave(4).setStep('C');
    let note2 = new Note().setOctave(4).setStep('C');
    
    expect( Note.equals(note1, note2) ).toEqual( true );

    note2.setAlter(-1);
    expect( Note.equals(note1, note2) ).toEqual( false );
});