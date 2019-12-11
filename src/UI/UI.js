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
                                                            console.log("RECORDING....");
        }else{
                                                            console.log("END RECORDING...");
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
                                                            console.log("CLEAR RECORDING!");
    });
    
});

