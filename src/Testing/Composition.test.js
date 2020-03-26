const {Composition, Part, Measure} = require('../MusicXML/Composition');


/////////////////////////COMPOSITION/////////////////////////////////////////
var composition = new Composition();

test('instance and base attributes', () => {
    expect(composition).toBeInstanceOf( Composition );

    expect( composition.hasOwnProperty('_partList') ).toEqual( true );
    expect( composition.hasOwnProperty('_title') ).toEqual( true ); 
});

test('setter (addPart, setTitle) to return this', () => {
    expect( composition.addPart( new Part(1)) ).toBeInstanceOf( Composition );
    expect( composition.setTitle( "Example" )).toBeInstanceOf( Composition );
})

test('addPart parameter expect to be instance of Part', () => {
    expect( composition.addPart( new Part(1)) ).toBeInstanceOf( Composition );
    expect( () => {composition.addPart(2) }).toThrow();
});


test('ToMusicXML Responds with object', () => {
    let oneComposition = new Composition();

    expect( typeof oneComposition.toMusicXMLinJSON() ).toBe("object");

    oneComposition.setTitle('example title');
    oneComposition.addPart( new Part(1) );

    expect( typeof oneComposition.toMusicXMLinJSON() ).toBe("object");
});

test('Download Composition', () => {
    expect( composition.download() ).toBe(undefined);
});