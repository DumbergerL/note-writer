const xmlConverter = require('xml-js');

class Note{
    constructor(){
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
    
    get durationTimestamp(){ return (this.timestampEnd - this.timestampStart); }
    get timestampStart(){ return (this._timestampStart); }
    get timestampEnd(){ return (this._timestampEnd); }
    get velocity(){ return this._velocity; }

    setStep(step){
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
        return ""+this.note+this.octave;
    }

    toMusicXML(){
        if(this.step === null || this.octave === null || this.duration === null)throw "Step, Octave and Duration is not set. Cant construct MusicXML Note.";
        const toneJSON = {
            note: {
                pitch: {
                    step: { _text: this.step },
                    octave: { _text: this.octave}
                },
                duration: { _text: this.duration, }
            }
        }

        if(this.alter !== null){
            toneJSON.note.pitch['alter'] = { _text: this.alter };
        }

        return xmlConverter.js2xml( toneJSON, { compact: true, ignoreComment: true, spaces: 4} );
    }

    toJSON(){
        const jsonObj = {};

        //add all private (_note) attributes to json
        const attributes = Object.getOwnPropertyNames(x);
        attributes.forEach( key => {
            if(key.charAt(0) === '_'){
                jsonObj[key.substring(1, key.length)] = this[key];
            }
        });

        return jsonObj;
    }

    static equals(n1, n2){
        return (n1.note === n2.note) && (n1.octave === n2.octave);
    }
}

Note.VALID_STEPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

module.exports = Note;