const Note = require('../../Utils/Note');
const {Cluster } = require('./Utils');

class ClusterAlgorithm{

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
}


module.exports = ClusterAlgorithm;