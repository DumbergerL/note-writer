const $ = require('jquery');
const Note = require('../../Utils/Note');

class PianoRole{

    constructor(pianoRoleID){
        this._pianoRoleID = pianoRoleID;
        this._visualizedNotes = [];
    }

    visualizeNotes( noteArray ){
        this._visualizedNotes = noteArray;
        var minNote = noteArray[0];
        var maxNote = noteArray[0];

        noteArray.forEach( note => {
            if(this._calcNoteValue(minNote) > this._calcNoteValue(note))minNote = note;
            if(this._calcNoteValue(maxNote) < this._calcNoteValue(note))maxNote = note;
        });

        this._initPianoRole(minNote, maxNote);
        this._outputNotes( noteArray );
    }

    clearNotes(){
        $(this._pianoRoleID+" .note").remove();
    }

    _initPianoRole(fromNote, toNote){
        if(fromNote.octave > toNote.octave)throw "Corrupt Notes!";

        $(this._pianoRoleID+' div.piano').empty();

        for(let curOctave = fromNote.octave; curOctave <= toNote.octave; curOctave++){
            if(curOctave === fromNote.octave){      //in FROM OCTAVE
                var startIndex = this._getPianoRoleIndex(fromNote);
                for(let index = startIndex; index < PianoRoleIds.length; index++){
                    this._appendKey( curOctave, PianoRoleIds[index]);
                }                
            }else if(curOctave === toNote.octave){  //in TO OCTAVE
                var endIndex = this._getPianoRoleIndex(toNote);
                for(let index = 0; index <= endIndex; index++){
                    this._appendKey( curOctave, PianoRoleIds[index]);
                }
            }else{                                  // between FROM and TO OCTAVE
                for(let index = 0; index < PianoRoleIds.length; index++){
                    this._appendKey( curOctave, PianoRoleIds[index]);
                }
            }
        }
    }
    
    _outputNotes( noteArray ){
        let maxTimestamp = 1;
        let minTimestamp = Infinity;
        noteArray.forEach( note => {
            if(maxTimestamp < (note.timestampStart + note.durationTimestamp)){
                maxTimestamp = (note.timestampStart + note.durationTimestamp);
            }
            if(minTimestamp > (note.timestampStart)){
                minTimestamp = note.timestampStart;
            }
        });

        let noteWorspaceWidth = $('.swimlane .notes').first().width();
        let scale = noteWorspaceWidth / (maxTimestamp - minTimestamp);
        
        noteArray.forEach( note => {
            let pianoRoleId = this._getPianoRoleId(note);
            let offset = (note.timestampStart - minTimestamp) * scale;
            let offsetPercent = (note.timestampStart - minTimestamp) / (maxTimestamp - minTimestamp);
            let width = note.durationTimestamp * scale;

            $('.key.key-'+ pianoRoleId +'.octave-'+note.octave+' + .notes').first().append(`
                <div class="note" style="margin-left: `+offset+`px; width: `+ width +`px;"></div>
            `);
        });     
    }

    _appendKey(octave, keyId){
        $(this._pianoRoleID+' div.piano').prepend(`
                <div class="swimlane">
                    <div class="key key-`+keyId+` octave-`+octave+`"></div>
                    <div class="notes"></div>
                </div>
        `);
    }

    _getPianoRoleId(note){
        return PianoRoleIds[this._getPianoRoleIndex(note)];
    }

    _getPianoRoleIndex(note){
        let index = PianoRoleIds.indexOf( note.step.toLowerCase() );
        if(index === undefined)throw "Can't find Piano Role Index";

        index += note.alter;

        if(index < 0)index += PianoRoleIds.length;
        if(index > PianoRoleIds.length-1)index -= PianoRoleIds.length;

        return index;
    }

    _calcNoteValue( note ){
        return (note.octave * PianoRoleIds.length) + (this._getPianoRoleIndex(note));
    }
}

const PianoRoleIds = ['c', 'cS', 'd', 'dS', 'e', 'f', 'fS', 'g', 'gS', 'a', 'aS', 'b'];

window.PIANO_ROLE = new PianoRole('#piano-role-1');

///////// ADDITIONAL CODE!!!!!////////////////
/*PIANO_ROLE._initPianoRole(
    (new Note().setStep('E').setOctave(3)),
    (new Note().setStep('A').setOctave(6))
);*/

var array = [
    (new Note().setStep('C').setOctave(4).setAlter(0).setTimestampStart(2000).setTimestampEnd(2100)),
    (new Note().setStep('D').setOctave(4).setAlter(-1).setTimestampStart(2200).setTimestampEnd(2300)),
    (new Note().setStep('E').setOctave(4).setAlter(0).setTimestampStart(2400).setTimestampEnd(2500)),
    (new Note().setStep('F').setOctave(4).setAlter(+1).setTimestampStart(2600).setTimestampEnd(2700)),
    (new Note().setStep('G').setOctave(4).setAlter(0).setTimestampStart(2800).setTimestampEnd(3000)),
    (new Note().setStep('A').setOctave(4).setAlter(-1).setTimestampStart(2900).setTimestampEnd(3000)),
    (new Note().setStep('B').setOctave(4).setAlter(0).setTimestampStart(3000).setTimestampEnd(3500))    
]

PIANO_ROLE.visualizeNotes(array);