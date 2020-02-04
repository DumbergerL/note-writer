const $ = require('jquery');

$(function(){
    
    setTimeout( () => {
        $('#status-button-title').text(''+STREAM._midiController.output.name);
        $('#status-button').removeClass('is-loading');
    }, 1500);

    $('#button-record').click( () => {
        $('#button-record').toggleClass('is-danger');
        $('#button-record').toggleClass('glow');

        if($('#button-record').hasClass('glow')){
            window.PROCESSOR.clearNotes();
            window.PIANO.clearRecord();
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
            window.PIANO.pauseRecord();                                                     
        }else{
            window.PIANO.playRecord(); 
            
        }
    });

    $('#button-clear').click( () => {
        window.PROCESSOR.clearNotes();
        window.PROCESSOR.initComposition();
        window.PIANO_ROLE.clearNotes();
        window.PIANO.clearRecord();

    });
    

    $('#process-dbscan').click( () => {
        window.PROCESSOR.processNoteDurationDBSCAN();
    });

    $('#process-kmeans').click( () => {
        window.PROCESSOR.processNoteDurationKMEANS();
    });

    $('#process-e').change( () => {
        PROCESSOR._e = parseInt( $('#process-e').val() );
    });

    $('#process-k').change( () => {
        PROCESSOR._k = parseInt( $('#process-k').val() );
    });
    

    $('#button-note-play').click( () => {
        $('#button-note-play i').toggleClass('fa-pause');
        $('#button-note-play i').toggleClass('fa-play');
        
        if($('#button-note-play i').hasClass('fa-play')){
            window.PIANO.pauseRecord();                                                     
        }else{
            window.PIANO.playRecordDuration(); 
            
        }
    });

    $('#note-play-tempo').change( () => {
        window.PIANO._tempo = parseInt( $("#note-play-tempo").val() );
    });

    $('#button-download').click( () => {
        PROCESSOR._composition.download('My Symphonie');
    });
});

