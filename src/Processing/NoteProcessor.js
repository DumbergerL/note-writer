const BPM = require('../Utils/BPM');
const OSMD = require('../OSMD/index');
const {Composition, Part, Measure} = require('../MusicXML/Composition');
const DBSCAN = require('./Clustering/dbscan');
const KMeans = require('./Clustering/k-means');
const BPMProcessing = require('./Clustering/BPMProcessing');
const Note = require('../Utils/Note');

class NoteProcessor{

    constructor(){
        this._notes = [];
        this._composition = new Composition().setTitle("Note-Writer");
        this._part = new Part('P1').setName('Beethovens Piano');
        this._osmd = OSMD;


        this._k = 2;
        this._e = 200;

        this._classificationTimes = [6,12,24,48,96];
        //this._classificationTimes = [6,9,12,18,24,36,48,72,96];
        
        this._composition.addPart( this._part );
    }

    addStemNotes( addStemNotes = true)
    {
        if(addStemNotes === true){
            this._classificationTimes = [6,9,12,18,24,36,48,72,96];
        }else{
            this._classificationTimes = [6,12,24,48,96];
        }
    }    

    initComposition(){
        this._composition = new Composition().setTitle("Note-Writer");
        this._part = new Part('P1').setName('Beethovens Piano');

        this._composition.addPart( this._part );
        OSMD.renderMusicXML( this._composition.toMusicXML() );
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

    classifyClusterMap(){
        this._map.forEach( (clusterMap, index) => {
            if(index === 0){
                clusterMap.duration = 12;
            }else{
                let calculatedDuration = (clusterMap.centroid / this._map[0].centroid) * 12;
                let nearestDuration = 12;
                let minDistance = Infinity;
                this._classificationTimes.forEach( duration => {
                    var distance = Math.abs(duration - calculatedDuration);
                    if(distance < minDistance){
                        nearestDuration = duration;
                        minDistance = distance;
                    }
                });
                clusterMap.duration = nearestDuration;
            }
        });
    }

    processNoteDurationDBSCAN(){
        this.initComposition();
        let dbscan = new DBSCAN( this._e ).setDataset( this._notes ).generateCluster(); 

        this._map = dbscan.getClusterCentroidMap();
    
        this.classifyClusterMap();

        console.log(this._map);

        this._notes.sort( (a,b) => {
            return (a.timestampStart - b.timestampStart);
        }).forEach( note => {
            let clusterId = dbscan.getClusterIdOfRecord( note );
            let duration = this._map.filter( element => element.cluster_id === clusterId)[0].duration;
            note.setDuration( duration);
        });


        this._notes.forEach( note => this._part.addNote( note ));        
        OSMD.renderMusicXML( this._composition.toMusicXML() );
    }

    processNoteDurationKMEANS(){
        this.initComposition();
        let dbscan4 = new KMeans( this._k ).setDataset( this._notes ).generateCluster();

        this._map = dbscan4.getClusterCentroidMap();
    
        this.classifyClusterMap();

        this._notes.sort( (a,b) => {
            return (a.timestampStart - b.timestampStart);
        }).forEach( note => {
            let clusterId = dbscan4.getClusterIdOfRecord( note );
            let duration = this._map.filter( element => element.cluster_id === clusterId)[0].duration;
            note.setDuration( duration);
        });

        this._notes.forEach( note => this._part.addNote( note ));        
        OSMD.renderMusicXML( this._composition.toMusicXML() );
    }

    processNoteDurationBPMClassification(){
        this.initComposition();
        let clusteringAlgorithm = new BPMProcessing().setDataset( this._notes ).generateCluster();

        this._map = clusteringAlgorithm.getClusterCentroidMap();

        this._map.forEach( map => {
            map.duration = map.cluster.elements[0].duration;
        });

        this._notes.forEach( note => this._part.addNote( note ));        
        OSMD.renderMusicXML( this._composition.toMusicXML() );
    }

    downloadNotesheet(){
        this._composition.download();
    }
}

module.exports = NoteProcessor;