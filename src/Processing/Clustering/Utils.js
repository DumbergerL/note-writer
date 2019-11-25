const Note = require('../../Utils/Note');

class Cluster{
    
    constructor(){
        this._elements = [];
        this._centroid = 0;
        this._maxDistance = 0;

        this._id = Cluster.GET_CLUSTER_ID();
    }

    addElement( note ){
        if(!(note instanceof Note))throw "Parameter must be from type Note";
        this._elements.push(note);
        return this;
    }

    dumpElements(){
        this._elements = [];
        return this;
    }

    setCentroidValue(timestampSumm){
        this._centroid = timestampSumm;
        return this;
    }

    calcCentroids(){    //WAS WENN KEINE ELEMENTE ZUGEORDNET WERDEN!?
        let centroidSumm = 0;
        this._elements.forEach( note => {
            centroidSumm += note.durationTimestamp
        });
        this._centroid = centroidSumm / (this._elements.length > 0 ? this._elements.length: 1);
        return this;
    }
    
    calcMaxDistance(){
        let maxDistance = 0;
        this._elements.forEach( note => {
            if( this.getDistance(note) > maxDistance){
                maxDistance = this.getDistance();
            }
        });
        return maxDistance;
    }

    getDistance( note ){
        if(!(note instanceof Note))throw "Parameter must be from type Note";
        return Math.abs( this.centroid - note.durationTimestamp );
    }


    get elements(){
        return this._elements;
    }

    get centroid(){
        return this._centroid;
    }

    get maxDistance(){
        return this._maxDistance;
    }

    get id(){
        return this._id;
    }

    static GET_CLUSTER_ID(){
        Cluster.CLUSTER_ID++;
        return "cluster_"+Cluster.CLUSTER_ID;
    }
}
Cluster.CLUSTER_ID = 0;


module.exports = {
    Cluster: Cluster
};