const {Cluster} = require('../../Processing/Clustering/Utils');
const Note = require('../../Utils/Note');

var cluster = new Cluster();

test('Instance and standard attributes', () => {
    expect( cluster ).toBeInstanceOf( Cluster );
    expect( cluster.hasOwnProperty('_elements') ).toEqual(true);
    expect( cluster.hasOwnProperty('_centroid') ).toEqual(true);
    expect( cluster.hasOwnProperty('_maxDistance') ).toEqual(true);
    expect( cluster.hasOwnProperty('_id') ).toEqual(true);
});

test('Setter/functions (addElement, dumpElements, setCentroidValue, calcCentroids, calcMaxDistance) respond with instance', () => {
    expect( cluster.addElement( (new Note()).setStep('C')) ).toBeInstanceOf( Cluster );
    //expect(()=>{ cluster.addElement()}).toThrow();
    //expect(()=>{ cluster.addElement("Bannane")}).toThrow();
    //expect(()=>{ cluster.addElement(32)}).toThrow();
    
    expect( cluster.dumpElements() ).toBeInstanceOf( Cluster );

    expect( cluster.setCentroidValue(200) ).toBeInstanceOf( Cluster );
    expect(() => { cluster.setCentroidValue("Test") }).toThrow();
    expect(() => { cluster.setCentroidValue() }).toThrow();
    
    expect( cluster.calcCentroid() ).toBeInstanceOf( Cluster);
    expect( cluster.calcMaxDistance() ).toBeInstanceOf( Cluster);    
});

test('Getter (getDistance, elements, centroid, maxDistance, id) to return right values', () => {
    let theCluster = new Cluster();
    theCluster.addElement( (new Note().setTimestampStart(20).setTimestampEnd(40)))
        .addElement( (new Note().setTimestampStart(5).setTimestampEnd(45)))
        .addElement( (new Note().setTimestampStart(5).setTimestampEnd(45)))
        .addElement( (new Note().setTimestampStart(50).setTimestampEnd(70)));

    expect(() => { theCluster.maxDistance }).toThrow();
    expect(() => { theCluster.centroid }).toThrow();

    theCluster.calcCentroid();
    theCluster.calcMaxDistance();

    expect( theCluster.maxDistance ).toEqual( 10 );
    expect( theCluster.centroid ).toEqual( 30 );
    
    expect( theCluster.elements ).toEqual( theCluster._elements);
    expect( theCluster.id ).toEqual( theCluster._id );
});

test('max- and minElement', () => {
    let theCluster = new Cluster();
    let n1 = new Note().setTimestampStart(0).setTimestampEnd(20),
        n2 = new Note().setTimestampStart(0).setTimestampEnd(10),
        n3 = new Note().setTimestampStart(0).setTimestampEnd(150),
        n4 = new Note().setTimestampStart(0).setTimestampEnd(12),
        n5 = new Note().setTimestampStart(0).setTimestampEnd(5);
    
    expect( () => { theCluster.maxElement }).toThrow();
    expect( () => { theCluster.minElement }).toThrow();
    
    theCluster.addElement(n1)
        .addElement(n2)
        .addElement(n3)
        .addElement(n4)
        .addElement(n5);
        
    expect( theCluster.maxElement ).toBeInstanceOf( Note );
    expect( theCluster.minElement ).toBeInstanceOf( Note );
});