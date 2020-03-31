const Measure = require('../MusicXML/CompositionElements/Measure');
const Note = require('../Utils/Note');

var measure = new Measure(1);

test('instance and base attributes', () => {
    expect(measure).toBeInstanceOf( Measure );

    expect( measure.hasOwnProperty('_number') ).toEqual( true );
    expect( measure.hasOwnProperty('_attributes') ).toEqual( true ); 
    expect( measure.hasOwnProperty('_notes') ).toEqual( true );  
});

test('expect measureNumber in constructor', () => {
    expect(() => { new Measure() }).toThrow();
    expect(() => { new Measure("Text") }).toThrow();
    expect(new Measure(2)).toBeInstanceOf( Measure );
});

test('getter (number, notes) equals attribues', () => {
    expect( measure.number ).toEqual( measure._number);
    expect( measure.notes ).toEqual( measure._notes);
});

test('getter measureDuration', () => {
    expect( 
        new Measure(1)
            .addNote( new Note().setDuration(12))
            .addNote( new Note().setDuration(6)).measureDuration
        ).toEqual(18);

    expect( new Measure(1).measureDuration ).toEqual(0);
});

test('setter return this', () => {
    expect( measure.setAttributes( {} )).toBeInstanceOf( Measure );
    expect( measure.addNote( new Note() ) ).toBeInstanceOf( Measure );
});

test('ToMusicXML Responds with object', () => {
    expect(() => { measure.toMusicXMLinJSON() }).toThrow();

    let newMeasure = new Measure(2);

    expect( typeof newMeasure.toMusicXMLinJSON() ).toBe('object');
});