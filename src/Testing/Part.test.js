const Part = require('../MusicXML/CompositionElements/Part');
const Measure = require('../MusicXML/CompositionElements/Measure');
const Note = require('../Utils/Note');

/////////////////////////PART//////////////////////////////////////////////////
var part = new Part(1);

test('instance and base attributes', () => {
    expect(part).toBeInstanceOf( Part );

    expect( part.hasOwnProperty('_id') ).toEqual( true );
    expect( part.hasOwnProperty('_name') ).toEqual( true ); 
    expect( part.hasOwnProperty('_measures') ).toEqual( true );  
});

test('expect partID in constructor', () => {
    expect(() => { new Part() }).toThrow();
    expect(new Part(2)).toBeInstanceOf( Part );
})

test('getter (name, id) equals attribues', () => {
    expect( part.name ).toEqual( part._name);
    expect( part.id ).toEqual( part._id);
});

test('setter return this', () => {
    expect( part.setName('Test') ).toBeInstanceOf( Part );
    expect( part.addMeasure( new Measure(2) ) ).toBeInstanceOf( Part );
    expect( part.addNote( new Note() ) ).toBeInstanceOf( Part );
});

test('addMeasure and addNote expects instances', () => {

    expect( part.addMeasure( new Measure(1)) ).toBeInstanceOf( Part );
    expect( () => {part.addMeasure(2) }).toThrow();

    expect( part.addNote( new Note()) ).toBeInstanceOf( Part );
    //expect( () => {part.addNote(2) }).toThrow();
});

test('add new Measure if no measure exists and note comes in', () => {
    let cleanPart = new Part(1);

    expect( cleanPart.addNote( new Note()) ).toBeInstanceOf( Part );
});

test('ToMusicXML / ToMusicXMLPartListInJSON Responds with object', () => {
    
    let part = new Part(1).addMeasure( new Measure(1));

    expect( typeof part.toMusicXMLinJSON() ).toBe('object');
    expect( typeof part.toMusicXMLPartListinJSON() ).toBe('object'); 
    
    part.setName(null);
    expect( typeof part.toMusicXMLPartListinJSON() ).toBe('object'); 
    
});