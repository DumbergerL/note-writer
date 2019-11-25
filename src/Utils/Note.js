const MusicXMLParser = require('../MusicXML/MusicXMLParser');

class Note extends MusicXMLParser{
    constructor(){
        super();
        this._step = null;
        this._octave = null;
        this._alter = null;
        this._duration = null;

        this._timestampStart = null;
        this._timestampEnd = null;
        this._velocity = 1;
    }

    get step(){ return this._step; }
    get octave(){ return this._octave; }
    get alter(){ return this._alter; }
    get duration(){ return this._duration; }
    get type(){
        let theDurationType = Note.TYPES.filter( durationType => {
            return durationType.duration === this.duration;
        })[0];
        return theDurationType ? theDurationType.type : null;
    }
    
    get durationTimestamp(){ return parseInt(this.timestampEnd - this.timestampStart); }
    get timestampStart(){ return (this._timestampStart); }
    get timestampEnd(){ return (this._timestampEnd); }
    get velocity(){ return this._velocity; }
    hasEnded(){ return this._timestampEnd !== null;}

    get isRest(){ return (this.step === null || this.octave === null); }

    setStep(step){
        if(typeof step !== 'string')throw "Invalid step ("+step+") given in! Must be String!";
        if(step.includes('#')){
            step = step.replace('#', '');
            this.setAlter(1);
        }
        if(step.includes('b')){
            step = step.replace('b', '');
            this.setAlter(-1);
        }
        step = step.toUpperCase();
        if(!Note.VALID_STEPS.includes(step))throw "Invalid step ("+step+") given in!";
        this._step = step; 
        return this; 
    }
    setOctave(octave){ 
        if(!Number.isInteger(octave) || octave < 0)throw "Invalid octave ("+octave+") given in!";
        this._octave = octave; 
        return this; 
    }
    setAlter(alter){ 
        if(!Number.isInteger(alter) || alter < -2 || alter > 2)throw "Invalid alter ("+alter+") given in!";
        this._alter = alter; 
        return this;
    }
    setDuration(duration){
        if(!Number.isInteger(duration) || duration < 0)throw "Invalid duration ("+duration+") given in!";
        this._duration = duration;
        return this;
    }

    setTimestampStart(timestamp){  this._timestampStart = timestamp; return this; }
    setTimestampEnd(timestamp){  this._timestampEnd = timestamp; return this; }
    setVelocity(velocity){ this._velocity = velocity; return this; }
    

    toString(){
        return ""+this.step+this.octave;
    }

    toMusicXMLinJSON(){
        if(this.duration === null)throw "Duration is not set. Cant construct MusicXML Note.";
        const toneJSON = {}
        if(this.isRest){
            toneJSON.note = {
                    rest: { }
                };
        }else{
            toneJSON.note = {
                    pitch: {
                        step: { _text: this.step },
                        octave: { _text: this.octave}
                    },
                };
        }

        toneJSON.note.duration = { _text: this.duration };
              
        if(this.alter !== null){
            toneJSON.note.pitch['alter'] = { _text: this.alter };
        }

        if(this.type !== null){
            toneJSON.note.type = { _text: this.type };
        }

        return toneJSON;
    }

    toJSON(){
        const jsonObj = {};

        //add all private (_note) attributes to json
        const attributes = Object.getOwnPropertyNames(this);
        attributes.forEach( key => {
            if(key.charAt(0) === '_'){
                jsonObj[key.substring(1, key.length)] = this[key];
            }
        });


        jsonObj['durationTimestamp'] = this.durationTimestamp;
        jsonObj['isRest'] = this.isRest;
        jsonObj['type'] = this.type;
        jsonObj['velocity'] = this.velocity;

        return jsonObj;
    }

    static equals(n1, n2){
        return (n1.step === n2.step) && (n1.octave === n2.octave) && (n1.alter === n2.alter);
    }

    static validate( note ){
        if(!(note instanceof Note))throw "Parameter given in must be type of Note!";
        return true;
    }

    static clone( note ){
        if (null == note || "object" != typeof note) return note;
        var copy = new Note();
        for (var attr in note) {
            if (note.hasOwnProperty(attr)) copy[attr] = note[attr];
        }
        return copy;
    }
}

Note.VALID_STEPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
Note.TYPES = [ 
    { duration: 96, type: 'whole'},
    { duration: 48, type: 'half'},
    { duration: 24, type: 'quarter'},
    { duration: 12, type: 'eighth'},
    { duration: 6, type: '16th'},
    { duration: 3, type: '32nd'},    
];

module.exports = Note;