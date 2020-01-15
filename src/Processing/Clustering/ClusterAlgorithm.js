const Note = require('../../Utils/Note');
const {Cluster } = require('./Utils');

class ClusterAlgorithm{ //ABSTRACT

    constructor(){
        this._cluster = [];
        this._dataset = [];
    }

    setDataset( noteArray ){
        this._dataset = noteArray;
        return this;
    }

    getClusterIdOfRecord( note ){
        return this._getClusterIdOfRecord(note);
    }

    getClusterCentroidMap(){
        let map = [];
        this._cluster.forEach( cluster => {
            cluster.calcCentroid();
            map.push(
                {
                    cluster_id: cluster.id,
                    centroid: cluster.centroid,
                    cluster: cluster
                }
            );
        }); 

        map.sort( (a,b) => {
            return (a.centroid - b.centroid);
        });

        return map;
    }
}


module.exports = ClusterAlgorithm;