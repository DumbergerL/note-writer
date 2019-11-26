const Note = require('../Utils/Note');
const KMeans = require('./Clustering/k-means');
const DBSCAN = require('./Clustering/dbscan');

class NoteDump{

    constructor(){
        this._dump = [];   
    }

    addNote( note ){
        Note.validate(note);
        this._dump.push(note);
        return this;
    }

    downloadDump(){
        console.log("DOWNLOAD THE DUMP!");
        let json = [];

        let k2Means = new KMeans(2);
        let k3Means = new KMeans(3);
        let k4Means = new KMeans(4);
        let k5Means = new KMeans(5);
        
        k2Means.setDataset( this._dump ).generateCluster(100);
        k3Means.setDataset( this._dump ).generateCluster(100);
        k4Means.setDataset( this._dump ).generateCluster(100);
        k5Means.setDataset( this._dump ).generateCluster(100);


        let dbscan1 = new DBSCAN( 25 ).setDataset( this._dump ).generateCluster();
        let dbscan2 = new DBSCAN( 50 ).setDataset( this._dump ).generateCluster();
        let dbscan3 = new DBSCAN( 100 ).setDataset( this._dump ).generateCluster();
        let dbscan4 = new DBSCAN( 200 ).setDataset( this._dump ).generateCluster(); // <-- performet am besten!
        let dbscan5 = new DBSCAN( 300 ).setDataset( this._dump ).generateCluster();
        let dbscan6 = new DBSCAN( 400 ).setDataset( this._dump ).generateCluster();
        

        this._dump.forEach( (note, index) => {
            if(index === this._dump.length - 1)return;  //ignore last Element
            let noteJSON = note.toJSON();
            noteJSON['cluster_k2'] = k2Means.getClusterIdOfRecord(note);
            noteJSON['cluster_k3'] = k3Means.getClusterIdOfRecord(note);
            noteJSON['cluster_k4'] = k4Means.getClusterIdOfRecord(note);
            noteJSON['cluster_k5'] = k5Means.getClusterIdOfRecord(note);

            noteJSON['cluster_dbscan1'] = dbscan1.getClusterIdOfRecord(note);
            noteJSON['cluster_dbscan2'] = dbscan2.getClusterIdOfRecord(note);
            noteJSON['cluster_dbscan3'] = dbscan3.getClusterIdOfRecord(note);
            noteJSON['cluster_dbscan4'] = dbscan4.getClusterIdOfRecord(note);
            noteJSON['cluster_dbscan5'] = dbscan5.getClusterIdOfRecord(note);
            noteJSON['cluster_dbscan6'] = dbscan6.getClusterIdOfRecord(note);

            json.push( noteJSON );

        });

        var dataStr = "data:json;charset=utf-8," + encodeURIComponent( JSON.stringify( json ) );
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "dump.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

}

module.exports = NoteDump;