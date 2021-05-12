const WebMidi = require('webmidi');


class MIDIController{
    
    static INIT_WEBMIDI(){
        return new Promise( (resolve, reject) => {
            MIDIController.WebMidi = WebMidi;
            MIDIController.WebMidi.enable( function(err){
                if(err){
                    reject('WebMidi could not be enabled.'+err.message);
                }else{
                    resolve();
                }
            })
        });
    }

    constructor(controllerName = null){
        this.controllerName = controllerName;
    }

    initController(){
        var staticWebMidi = new Promise( (resolve, reject) => {
            if(! MIDIController.WebMidi){
                MIDIController.INIT_WEBMIDI().then( () => {
                    resolve();
                }).catch( (e) => {reject(e);});
            }else{
                resolve();
            }
        });

     
        return new Promise( (resolve, reject ) => {
            staticWebMidi.then( () => {

                if(MIDIController.WebMidi.inputs.length <= 0){
                    reject("No MIDI Device detected!");
                }

                if(this.controllerName){
                    this.output = MIDIController.WebMidi.getOutputByName(this.controllerName);
                    this.input = MIDIController.WebMidi.getInputByName(this.controllerName);
                }else{
                    this.output = MIDIController.WebMidi.outputs[0];
                    this.input = MIDIController.WebMidi.inputs[0];
                
                    console.log("INPUT", MIDIController.WebMidi.inputs);
                }
                
                console.log(this);

                this.isInitialized = true;
                resolve(this);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    onNoteOn( callback){
        this._checkMidiDevice();
        this.input.addListener('noteon', 'all', callback);
    }

    onNoteOff( callback ){
        this._checkMidiDevice();
        this.input.addListener('noteoff', 'all', callback);
    }

    onInput( callback ){
        this._checkMidiDevice();
        this.input.addListener('controlchange', 'all', callback);
    }

    playNote (note, channel='all', options={duration: 1500}){
        this._checkMidiDevice();
        this.output.playNote(note, channel, options);
    }

    _checkMidiDevice(){
        if(!this.isInitialized)throw "MIDI-Controller is not initialized yet!";
    }
}

module.exports = MIDIController;