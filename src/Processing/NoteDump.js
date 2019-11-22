const Note = require('../Utils/Note');

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
        let json = [];

        this._dump.forEach( note => {
            json.push( note.toJSON());
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