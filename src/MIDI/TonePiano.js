const Tone = require('tone');

class TonePiano{

    constructor(){
        this._recordedNotes = [];
        this._piano = null;
        this._initPiano();
    }

    _initPiano(){
        this._piano = new Tone.Synth().toMaster();
    }
    get recordedNotes(){ return this._recordedNotes; }

    addNote( note ){
        this._recordedNotes.push(
            note
        );
        return this;
    }


    _setNotesToT0(){
        var minTimestamp = this._recordedNotes[0].timestampStart;

        this._recordedNotes.forEach( (note) => {
            note
            .setTimestampStart( (note.timestampStart - minTimestamp) )
            .setTimestampEnd( (note.timestampEnd - minTimestamp) );
            
        });
    }

    playRecord(){
        if(this._recordedNotes.length <= 0)return;
        //this._initPiano();

        window.TRANSPORT = Tone.Transport;

        Tone.Transport.stop();
        Tone.Transport.position = 0;
        Tone.Transport.cancel();

        this._setNotesToT0();

            this._recordedNotes.forEach( note => {
                console.log("SCHEDULE:", (note.step+''+note.octave), (note.durationTimestamp/1000), (note.timestampStart/1000));
                Tone.Transport.scheduleRepeat((time) => {
                    this._piano.triggerAttackRelease( (note.step+''+note.octave), (note.durationTimestamp/1000), (note.timestampStart/1000));
                });
            });    
        
        //Tone.Transport.loop = true;
        //Tone.Transport.start();
/*        var tick = 0;
        var interval = 5;
        var clockInterval = setInterval(() => {
            tick++;
        
            if(this._recordedNotes.length <= 1)clearInterval(clockInterval);
        
            try{
                var note = this._recordedNotes[0];
                
                var timeout = (note.timestampStart - (tick * interval));

                setTimeout( () =>{ this._playNote(note);}, timeout);

                this._recordedNotes.splice(0,1);
            }catch(e){
                console.log("ERROR IN NEXT LINE", e);
                clearInterval(this.clockInterval);
            }
        }, interval);*/
    }

    clearRecord(){
        this._recordedNotes = [];
    }
}

module.exports = TonePiano;