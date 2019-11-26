const Note = require('../../Utils/Note');
const {Cluster } = require('./Utils');
const ClusterAlgorithm = require('./ClusterAlgorithm');

class DBSCAN extends ClusterAlgorithm{

    constructor(e = 2000){
        super();
        this._e = e;   
    }

    generateCluster(){
        this._dataset.sort( (a,b) => {
            return (a.durationTimestamp - b.durationTimestamp);
        });

        this._cluster.push(
            new Cluster().addElement( this._dataset[0] )
        );
        
        this._dataset.forEach( (note,index) => {   //assumption: cluster1 have already been clustered, cluster2 have no cluster
            if(index <= 0)return;
            
            let currentCluster = this._cluster[ this._cluster.length - 1 ];
            let maxDuration = currentCluster.maxElement.durationTimestamp;

            if( note.durationTimestamp < (maxDuration + this._e)){
                currentCluster.addElement( note );
            }else{
                this._cluster.push(
                    new Cluster().addElement( note )
                );
            }
        });

        return this;
    }

    _getClusterIdOfRecord(note){
        let clusterId = undefined;
        this._cluster.forEach( cluster => {
            let maxValue = cluster.maxElement.durationTimestamp,
                minValue = cluster.minElement.durationTimestamp;

            if( note.durationTimestamp > (minValue - this._e) && note.durationTimestamp < (maxValue + this._e)){
                clusterId = cluster.id;
            }
        });
        if(clusterId){
            return clusterId;
        }
        throw "Given in note couldnt be clustered!";
    }
}

module.exports = DBSCAN;