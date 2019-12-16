const $ = require('jquery');

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
            console.log("PAUSE PIANO");                                                       
        }else{
            window.PIANO.playRecord(); 
            
        }
    });

    $('#button-clear').click( () => {
        window.PROCESSOR.clearNotes();
        window.PIANO_ROLE.clearNotes();
        window.PIANO.clearRecord();
    });
    
});

