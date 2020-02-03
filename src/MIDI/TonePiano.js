const Tone = require('tone');

class TonePiano{

    constructor(){
        this._recordedNotes = [];
        this._piano = null;
        this._initPiano();
    }

    _initPiano(){
        //this._piano = new Tone.Synth().toMaster();
        this._piano = new Tone.Sampler({
			"A0" : "A0.[mp3|ogg]",
			"C1" : "C1.[mp3|ogg]",
			"D#1" : "Ds1.[mp3|ogg]",
			"F#1" : "Fs1.[mp3|ogg]",
			"A1" : "A1.[mp3|ogg]",
			"C2" : "C2.[mp3|ogg]",
			"D#2" : "Ds2.[mp3|ogg]",
			"F#2" : "Fs2.[mp3|ogg]",
			"A2" : "A2.[mp3|ogg]",
			"C3" : "C3.[mp3|ogg]",
			"D#3" : "Ds3.[mp3|ogg]",
			"F#3" : "Fs3.[mp3|ogg]",
			"A3" : "A3.[mp3|ogg]",
			"C4" : "C4.[mp3|ogg]",
			"D#4" : "Ds4.[mp3|ogg]",
			"F#4" : "Fs4.[mp3|ogg]",
			"A4" : "A4.[mp3|ogg]",
			"C5" : "C5.[mp3|ogg]",
			"D#5" : "Ds5.[mp3|ogg]",
			"F#5" : "Fs5.[mp3|ogg]",
			"A5" : "A5.[mp3|ogg]",
			"C6" : "C6.[mp3|ogg]",
			"D#6" : "Ds6.[mp3|ogg]",
			"F#6" : "Fs6.[mp3|ogg]",
			"A6" : "A6.[mp3|ogg]",
			"C7" : "C7.[mp3|ogg]",
			"D#7" : "Ds7.[mp3|ogg]",
			"F#7" : "Fs7.[mp3|ogg]",
			"A7" : "A7.[mp3|ogg]",
			"C8" : "C8.[mp3|ogg]"
		}, {
			"release" : 1,
			"baseUrl" : "./audio/salamander/"
		}).toMaster();
    }
    get recordedNotes(){ return this._recordedNotes; }

    addNote( note ){
        this._recordedNotes.push(
            note
        );
        return this;
    }

    setNotes( notes ){
        this._recordedNotes = notes;
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
                this._piano.triggerAttackRelease( (note.step+''+ (note.alter === 1 ? '#' : note.alter === -1 ? 'b' : '')+note.octave), (note.durationTimestamp/1000) );
            }, (note.timestampStart/1000));
        });    

        var endMelodie = this._recordedNotes[ this._recordedNotes.length - 1].timestampStart + this._recordedNotes[ this._recordedNotes.length - 1].durationTimestamp;

        Tone.Transport.schedule( time => {
            document.getElementById('button-play').click(); // REALLY BAD PROGRAMMING! - I know ;-)
        }, (endMelodie/1000));

        Tone.Transport.start();
    }

    playRecordDuration(){
        if(this._recordedNotes.length <= 0)return;

        const BPM = 120;
        const T_MIDI_STEP = 60 / (BPM * 24);

        window.TRANSPORT = Tone.Transport;

        Tone.Transport.stop();
        Tone.Transport.position = 0;
        Tone.Transport.cancel();

        let currentMidiStep = 0;

        this.recordedNotes.forEach( note => {
            Tone.Transport.schedule( time => {
                this._piano.triggerAttackRelease( (note.step+''+ (note.alter === 1 ? '#' : note.alter === -1 ? 'b' : '')+note.octave), (note.duration*T_MIDI_STEP) );
            }, currentMidiStep * T_MIDI_STEP);
            currentMidiStep += note.duration;
        });

        var endMelodie = currentMidiStep * T_MIDI_STEP;

        Tone.Transport.schedule( time => {
            document.getElementById('button-note-play').click(); // REALLY BAD PROGRAMMING! - I know ;-)
        }, endMelodie);

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