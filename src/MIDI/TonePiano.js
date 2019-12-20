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

        window.TRANSPORT = Tone.Transport;

        Tone.Transport.stop();
        Tone.Transport.position = 0;
        Tone.Transport.cancel();

        this._setNotesToT0();
            this._recordedNotes.forEach( note => {
                Tone.Transport.schedule( time => {
                    this._piano.triggerAttackRelease( (note.step+''+note.octave), (note.durationTimestamp/1000) );
                }, (note.timestampStart/1000));
            });    

            var endMelodie = this._recordedNotes[ this._recordedNotes.length - 1].timestampStart + this._recordedNotes[ this._recordedNotes.length - 1].durationTimestamp;

            Tone.Transport.schedule( time => {
                document.getElementById('button-play').click(); // REALLY BAD PROGRAMMING! - I know ;-)
            }, (endMelodie/1000));

        Tone.Transport.start();
    }

    pauseRecord(){
        Tone.Transport.stop();
    }
    clearRecord(){
        this._recordedNotes = [];
    }
}

module.exports = TonePiano;