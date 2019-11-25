const Note = require('../Utils/Note');
const KMeans = require('./Clustering/k-means');

class NoteDump{

    constructor(){
        this._dump = [];   
    }

    addNote( note ){
        if(!(note instanceof Note))throw "Paremeter must be instance of Note!";
        this._dump.push(note);
        return this;
    }

    downloadDump(){
        console.log("DOWNLOAD THE DUMP!");
        let json = [];

        let kMeans = new KMeans(3);
        kMeans.setDataset( this._dump ).generateCluster(100);


        this._dump.forEach( (note, index) => {
            if(index === this._dump.length - 1)return;  //ignore last Element
            let noteJSON = note.toJSON();
            noteJSON.cluster = kMeans.getClusterIdOfRecord(note);
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