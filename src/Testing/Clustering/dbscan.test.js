const DBSCAN = require('../../Processing/Clustering/dbscan');
const Note = require('../../Utils/Note');

let dbscan = new DBSCAN();

test('Instance and check for base properties', () => {
    expect(dbscan).toBeInstanceOf(DBSCAN);
    expect(dbscan.hasOwnProperty('_e')).toBe(true);
});

test('Generate cluster throws if no data is set', () => {
    expect(() => { dbscan.generateCluster() }).toThrow();
});

test('Generate cluster', () => {
    let testDBSCAN = new DBSCAN(200);
    let exampleNote = new Note().setTimestampStart(0).setTimestampEnd(1600);
    let untrackedNote = new Note().setTimestampStart(0).setTimestampEnd(20000000000);
    
    testDBSCAN.setDataset([
        new Note().setTimestampStart(0).setTimestampEnd(800),
        exampleNote,
        new Note().setTimestampStart(0).setTimestampEnd(800),
        new Note().setTimestampStart(0).setTimestampEnd(800),
        new Note().setTimestampStart(0).setTimestampEnd(1600),
        new Note().setTimestampStart(0).setTimestampEnd(1600),
    ]);

    expect(testDBSCAN.generateCluster() ).toBeInstanceOf(DBSCAN);

    expect(typeof testDBSCAN.getClusterIdOfRecord(exampleNote)).toBe('string');

    expect(() => { testDBSCAN.getClusterIdOfRecord(untrackedNote) }).toThrow();
});