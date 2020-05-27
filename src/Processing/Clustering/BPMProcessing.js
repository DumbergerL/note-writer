const Note = require('../../Utils/Note');
const {Cluster } = require('./Utils');
const ClusterAlgorithm = require('./ClusterAlgorithm');

class BPMProcessing extends ClusterAlgorithm{

    constructor(){
        super();   
        
        this._classifications = [
                {lowerLimit: 1600, upperLimit: 3000, duration: 96},
                {lowerLimit: 800, upperLimit: 1500, duration: 48},
                {lowerLimit: 400, upperLimit: 750, duration: 24},
                {lowerLimit: 200, upperLimit: 375, duration: 12}                
            ];
    }

    generateCluster(){
        if(this._dataset.length <= 0) throw "There is no data set, to generate Clusters from.";
        
        this._dataset.forEach( note => {
            var duration = 6;
            this._classifications.forEach( bpmClass => {
                if( note.durationTimestamp > bpmClass.lowerLimit && note.durationTimestamp < bpmClass.upperLimit){
                    duration = bpmClass.duration;
                }
            });

            note.setDuration( duration );

            var cluster = null;
            this._cluster.forEach( oneCluster => {
                if(oneCluster.elements[0].duration === duration){
                    cluster = oneCluster
                }
            });
            if(cluster === null){
                cluster = new Cluster();
                this._cluster.push(cluster);
            }

            cluster.addElement( note );
        });

        return this;
    }

    _getClusterIdOfRecord(note){
        var clusterId = null
        this._cluster.forEach( cluster => {
            console.log("COMPARE", cluster.elements[0].duration, note.duration);
            if(cluster.elements[0].duration === note.duration){
                clusterId = cluster.id;
                console.log("FOUND CLUSTER!!!", cluster.id);
            }
        });
        if(clusterId === null){
            //throw "Given in note couldnt be clustered!";
        }
        return clusterId;
    }
}

module.exports = BPMProcessing;