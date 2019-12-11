const $ = require('jquery');

/*
var DigitalPiano = new MIDIController();
var Recorder = new MIDIRecorder();
*/


$(function(){
    
    $('#button-record').click( () => {
        $('#button-record').toggleClass('is-danger');
        $('#button-record').toggleClass('glow');

        if($('#button-record').hasClass('glow')){
            window.PROCESSOR.clearNotes();
            window.STREAM.setActive();
        }else{
            window.STREAM.setInactive();
            window.PIANO_ROLE.visualizeNotes( window.PROCESSOR.notes );
        }
    });


    $('#button-play').click( () => {
        $('#button-play i').toggleClass('fa-pause');
        $('#button-play i').toggleClass('fa-play');
        
        if($('#button-play i').hasClass('fa-play')){
                                                            console.log("PLAY RECORDING!");
        }else{
                                                            console.log("PAUSE PLAY RECORDING!");
        }
    });

    $('#button-clear').click( () => {
        window.PROCESSOR.clearNotes();
        window.PIANO_ROLE.clearNotes();
    });
    
});

