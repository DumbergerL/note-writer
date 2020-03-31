const MusicXMLParser = require('../MusicXML/MusicXMLParser');

class Note extends MusicXMLParser{
    constructor(){
        super();
        this._step = null;
        this._octave = null;
        this._alter = null;
        this._duration = null;
        this._stemUp = false;

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
    get stemUp(){ return this._stemUp; }
    
    get durationTimestamp(){ return parseInt(this.timestampEnd - this.timestampStart); }
    get timestampStart(){ return (this._timestampStart); }
    get timestampEnd(){ return (this._timestampEnd); }
    get velocity(){ return this._velocity; }
    hasEnded(){ return this._timestampEnd !== null;}

    get isRest(){ return (this.step === null || this.octave === null); }

    get color(){
        let noteColor = '#FF6EFF';
        switch (this.duration) {
            case 6:
                noteColor = '#00B326';
                break;
            case 9: //STEM
                noteColor = '#00B373';
                break;
            case 12:
                noteColor = '#8A40FF';
                break;
            case 18: //STEM
                noteColor = '#D836FF';
                break;
            case 24:
                noteColor = '#26FF55';
                break;
            case 36: //STEM
                noteColor = '#26FFB1';
                break;                    
            case 48:
                noteColor = '#FF920D';
                break;
            case 72://STEM
                noteColor = '#FFB90D';
                break;
            case 96:
                noteColor = '#B36A12';
                break;
            case 144: //STEM
                noteColor = '#B38412';
                break;
                        
        }
        return noteColor;
    }

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
        Note.TYPES.forEach(type => {
            if(type.duration === duration){
                this.setStemUp( type.stemUp );
            }
        });
        this._duration = duration;
        return this;
    }
    setStemUp( stemValue = true){
        this._stemUp = stemValue;
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

        if(this.stemUp === true){
            toneJSON.note.stem = { _text: 'up'};
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
        return true;
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
    { duration: 144, type: 'whole', stemUp: true},
    { duration: 96, type: 'whole', stemUp: false},
    
    { duration: 72, type: 'half', stemUp: true},
    { duration: 48, type: 'half', stemUp: false},

    { duration: 36, type: 'quarter', stemUp: true},
    { duration: 24, type: 'quarter', stemUp: false},
    
    { duration: 18, type: 'eighth', stemUp: true},
    { duration: 12, type: 'eighth', stemUp: false},
    
    { duration: 9, type: '16th', stemUp: true},
    { duration: 6, type: '16th', stemUp: false},

    { duration: 3, type: '32nd', stemUp: false},    
];

module.exports = Note;