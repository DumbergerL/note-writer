const Note = require('../../Utils/Note');

class Cluster{
    
    constructor(){
        this._elements = [];
        this._centroid = null;
        this._maxDistance = null;

        this._id = Cluster.GET_CLUSTER_ID();
    }

    addElement( note ){
        Note.validate(note);
        this._elements.push(note);
        return this;
    }

    dumpElements(){
        this._elements = [];
        return this;
    }

    setCentroidValue(timestampSumm){
        if(timestampSumm === undefined || Number(timestampSumm) !== timestampSumm)throw "Parameter must be Number!";
        this._centroid = timestampSumm;
        return this;
    }

    calcCentroid(){    //WAS WENN KEINE ELEMENTE ZUGEORDNET WERDEN!?
        let centroidSumm = 0;
        this._elements.forEach( note => {
            centroidSumm += note.durationTimestamp
        });
        this._centroid = centroidSumm / (this._elements.length > 0 ? this._elements.length: 1);
        return this;
    }
    
    calcMaxDistance(){
        this._maxDistance = 0;
        this._elements.forEach( note => {
            let calcDistance = this.getDistance( note );
            if( calcDistance > this._maxDistance){
                this._maxDistance = calcDistance;
            }
        });
        return this;
    }

    getDistance( note ){
        Note.validate(note);
        return Math.abs( this._centroid - note.durationTimestamp );
    }


    get elements(){
        return this._elements;
    }

    get centroid(){
        if(this._centroid === null)throw "Centroid undefined! Please exec calc Centroid!";
        return this._centroid;
    }

    get maxDistance(){
        if(this._maxDistance === null)throw "Max Distance undefined! Please exec calc Centroid!";
        return this._maxDistance;
    }

    get maxElement(){
        if(this._elements.length <= 0)throw "No elements available!";
        this._elements.sort( (a,b) => {
            return (a.durationTimestamp - b.durationTimestamp);
        });
        return this._elements[0];
    }

    get minElement(){
        if(this._elements.length <= 0)throw "No elements available!";
        this._elements.sort( (a,b) => {
            return (b.durationTimestamp - a.durationTimestamp);
        });
        return this._elements[0];
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