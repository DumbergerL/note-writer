const kMeans = require('./k-means');
const Note = require('../../Utils/Note');

let theCluster = new kMeans(2);

test('Instance and check for base properties', () => {
    expect(theCluster).toBeInstanceOf(kMeans);
    expect(theCluster.hasOwnProperty('_k')).toBe(true);
   // expect(() => {new kMeans("apple") }).toThrow();
});

test('Generate cluster throws if no data is set', () => {
    expect(() => { theCluster.generateCluster() }).toThrow();
});

test('Generate cluster', () => {
    let testKMeans = new kMeans(2);
    let exampleNote = new Note().setTimestampStart(0).setTimestampEnd(1600);
    
    testKMeans.setDataset([
        new Note().setTimestampStart(0).setTimestampEnd(800),
        exampleNote,
        new Note().setTimestampStart(0).setTimestampEnd(800),
        new Note().setTimestampStart(0).setTimestampEnd(1400),
        new Note().setTimestampStart(0).setTimestampEnd(900),
        new Note().setTimestampStart(0).setTimestampEnd(1000),
        new Note().setTimestampStart(0).setTimestampEnd(1600),
        new Note().setTimestampStart(0).setTimestampEnd(1300),
        new Note().setTimestampStart(0).setTimestampEnd(1100),
        new Note().setTimestampStart(0).setTimestampEnd(1500),
        new Note().setTimestampStart(0).setTimestampEnd(1200),
        new Note().setTimestampStart(0).setTimestampEnd(1600),
    ]);

    expect(testKMeans.generateCluster() ).toBeInstanceOf(kMeans);

    expect(typeof testKMeans.getClusterIdOfRecord(exampleNote)).toBe('string');

    console.log(testKMeans.getClusterCentroidMap());
});