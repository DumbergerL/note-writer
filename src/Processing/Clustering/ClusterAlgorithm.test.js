const ClusterAlgorithm = require('./ClusterAlgorithm');
const Note = require('../../Utils/Note');

var clusterAlgorithm = new ClusterAlgorithm();

test('Instance and standard attributes', () => {
    expect( clusterAlgorithm ).toBeInstanceOf( ClusterAlgorithm );
    expect( clusterAlgorithm.hasOwnProperty('_cluster') ).toEqual(true);
    expect( clusterAlgorithm.hasOwnProperty('_dataset') ).toEqual(true);
});

test('Setter/functions (setDataset, getClusterIdOfRecord, getClusterCentroidMap) respond with instance', () => {
    expect( clusterAlgorithm.setDataset( [(new Note()).setStep('C'), (new Note()).setStep('C')] )).toBeInstanceOf( ClusterAlgorithm );
});

