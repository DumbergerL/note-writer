const BPM = require('../Utils/BPM');
const OSMD = require('../OSMD/index');
const {Composition, Part, Measure} = require('../MusicXML/Composition');
const DBSCAN = require('./Clustering/dbscan');
const KMeans = require('./Clustering/k-means');
const Note = require('../Utils/Note');

class NoteProcessor{

    constructor(){
        this._notes = [];
        this._composition = new Composition().setTitle("In Dreams");
        this._part = new Part('P1').setName('Special Piano');

        this._composition.addPart( this._part );
    }

    get notes(){
        return this._notes;
    }

    pushNote(note){
        this._notes.push(note);
        return this;
    }

    clearNotes(){
        this._notes = [];
        return this;
    }

    processNoteDuration(){
        let dbscan4 = new DBSCAN( 200 ).setDataset( this._notes ).generateCluster(); 
        //let dbscan4 = new KMeans(4).setDataset( this._notes ).generateCluster();

        let map = dbscan4.getClusterCentroidMap();
    
        let CLASSIFICATION_80_140 = [
            {type: 'whole',     duration: 96,   upperBound: 3000,   lowerBound: 1710    },
            {type: 'half',      duration: 48,   upperBound: 1500,   lowerBound: 860     },
            {type: 'quarter',   duration: 24,   upperBound: 750,    lowerBound: 430     },
            {type: 'eighth',    duration: 12,   upperBound: 380,    lowerBound: 210     },
            {type: '16th',      duration: 6,    upperBound: 190,    lowerBound: 110     }
        ];

        map.forEach( (clusterMap, index) => {
            if(index === 0){
                clusterMap.duration = 12;
            }else{
                let calculatedDuration = (clusterMap.centroid / map[0].centroid) * 12;
                let nearestDuration = 12;
                [6,12,24,48,96].forEach( duration => {
                    if(Math.abs(duration-calculatedDuration) < nearestDuration)nearestDuration = duration;
                });
                clusterMap.duration = nearestDuration;
            }
        });

        console.log(map);
        
        this._notes.sort( (a,b) => {
            return (a.timestampStart - b.timestampStart);
        }).forEach( note => {
            let clusterId = dbscan4.getClusterIdOfRecord( note );
            let duration = map.filter( element => element.cluster_id === clusterId)[0].duration;
            note.setDuration( duration);
        });

        /*for(let i = 0; i < (this._notes.length-1); i++){
            console.log("NOTE "+i);
            let note1 = this._notes[i];
            let note2 = this._notes[i+1];

            let restTime = note2.timestampStart - note1.timestampEnd;
            try{
                let restNote = new Note()
                    .setTimestampStart( note1.timestampEnd + 1)
                    .setTimestampEnd( note2.timestampStart - 1 );
                let clusterId = dbscan4.getClusterIdOfRecord( restNote );
                let duration = map.filter( el => el.cluster_id === clusterId)[0].duration;
                
                restNote.setDuration( duration ); 
                
                this._notes.splice( i+1, 0, restNote);
            }catch(e){} //not clusterable
        }*/

        this._notes.forEach( note => this._part.addNote( note ));        
        OSMD.renderMusicXML( this._composition.toMusicXML() );
    }


    downloadNotesheet(){
        this._composition.download();
    }
}

module.exports = NoteProcessor;