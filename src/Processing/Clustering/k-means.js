const Note = require('../../Utils/Note');
const {Cluster } = require('./Utils');

class kMeans{

    constructor(k = null){
        if(!Number.isInteger(k) && k < 0)throw "k must be int and greater zero!";

        this._k = k;
        this._cluster = [];
        this._dataset = [];
    }

    setDataset( noteArray ){
        this._dataset = noteArray;
        return this;
    }

    generateCluster(maxIterations = 4){
        this._cluster = [];
        if(this._dataset.length < this._k)throw "Dataset must be more elements then "+this._k;

        for(let k = 0; k < this._k; k++){   //INIT CLUSTER
            let min = 0, max = this._dataset.length;

            let randomIndex = Math.floor( Math.random() * max) + min;
            this._cluster.push(  new Cluster().setCentroidValue( this._dataset[randomIndex].durationTimestamp ) );
        }

        for(let i = 0; i < maxIterations; i++){    //Zuordnung
            console.log("\nITERATION "+i+"\n");

            let noRecordSwitchedCluster = true;
            this._dataset.forEach( note => {
                let bestCluster = this.getNearestCluster( note );

                if(!note.hasOwnProperty('lastCluster')){
                    noRecordSwitchedCluster = false;
                }else{
                    if(note.lastCluster !== bestCluster.id)noRecordSwitchedCluster = false;
                }

                note.lastCluster = bestCluster.id;
                bestCluster.addElement( note );
            });

            if(noRecordSwitchedCluster){
                console.log("BREAK BECAUSE NOTHING CHANGED!");
                break;
            }

            this._cluster.forEach( cluster => { //Aktualisierung
                console.log( cluster.id  + " - " + cluster.centroid + " ("+ cluster.elements.length +")");
                cluster.calcCentroids();
                cluster.dumpElements();
            });
        }
    }

    getNearestCluster( note ){
        var minCluster = this._cluster[0];
        this._cluster.forEach( cluster => {
            if( cluster.getDistance(note) < minCluster.getDistance(note)){
                minCluster = cluster;
            }
        });
        return minCluster;
    }

    getClusterIdOfRecord( note ){
        return this.getNearestCluster(note).id;
    }
}

module.exports = kMeans;