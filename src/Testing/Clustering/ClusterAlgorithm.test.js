const ClusterAlgorithm = require('../../Processing/Clustering/ClusterAlgorithm');
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


test('getClusterIDofRecord throws, because its ment to be abstract', () => {
    let clusterAlgorithm = new ClusterAlgorithm();
    expect(() => { clusterAlgorithm.getClusterIdOfRecord() }).toThrow();
});

test('getClusterCentroidMap responds [] when no data is set', () => {
    let clusterAlgorithmWithoutCluster = new ClusterAlgorithm();
    expect( clusterAlgorithmWithoutCluster.getClusterCentroidMap() ).toEqual( [] );
});
