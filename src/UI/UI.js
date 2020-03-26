const $ = require('jquery');
const Note = require('../Utils/Note');

$(function(){
    
    setTimeout( () => {
        try{
            $('#status-button-title').text(''+STREAM._midiController.output.name);
            $('#status-button').removeClass('is-loading');
        }catch(e){
            console.log(e);
        }
    }, 1500);

    $('#button-import-export').click( () => {
        $('#modal-import-export-background').show();
        $('#modal-import-export').show(); 
    });

    $('#modal-import-export-dismiss, #modal-import-export-background').click( () => {
        $('#modal-import-export-background').hide();
        $('#modal-import-export').hide();
    });

    $('#button-export-json').click( () => {
        let exportObject = [];

        window.PROCESSOR.notes.forEach( note => {
            exportObject.push( note.toJSON() )
        });
        
        var dataStr = "data:json;charset=utf-8," + encodeURIComponent( JSON.stringify( exportObject ) );
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "note-writer-export.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });


    function importJSON( jsonText )
    {
        let importObject = [];
        let noteArray = [];

        window.PROCESSOR.clearNotes();
        window.PROCESSOR.initComposition();
        window.PIANO_ROLE.clearNotes();
        window.PIANO.clearRecord();

        try{
            let text = jsonText;
            importObject = JSON.parse( text );
        }catch(e){
            console.log(e);
            alert("Error im Import!");
        }

        importObject.forEach( noteData => {
            var note = new Note();
            if(noteData.hasOwnProperty('step'))note.setStep( noteData.step );
            if(noteData.hasOwnProperty('octave'))note.setOctave( noteData.octave );
            if(noteData.hasOwnProperty('alter') && noteData.alter != null)note.setAlter(noteData.alter);
            if(noteData.hasOwnProperty('duration') && noteData.duration != null)note.setDuration(noteData.duration);
            if(noteData.hasOwnProperty('timestampStart'))note.setTimestampStart( noteData.timestampStart);
            if(noteData.hasOwnProperty('timestampEnd'))note.setTimestampEnd(noteData.timestampEnd);
            if(noteData.hasOwnProperty('velocity'))note.setVelocity(noteData.velocity);
            noteArray.push( note );
            window.PIANO.addNote( note );
            window.PROCESSOR.pushNote( note );
        });      

        window.PIANO_ROLE.visualizeNotes( noteArray );
    }

    $('#button-import-json').click( () => {
        importJSON( $('#textarea-import-json').val() );
    });

    $('.preset-button').click( (e) => {
        let presetId = $(e.target).attr('presetId');
        importJSON( $('#preset-json-'+presetId).val() );
    });


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
        visualizeClusterMap(PROCESSOR._map);
        window.PIANO_ROLE.visualizeNotes( window.PROCESSOR.notes );
    });

    $('#process-kmeans').click( () => {
        window.PROCESSOR.processNoteDurationKMEANS();
        visualizeClusterMap(PROCESSOR._map);
        window.PIANO_ROLE.visualizeNotes( window.PROCESSOR.notes );
    });

    function visualizeClusterMap( clusterMap ){
        $('#cluster-map').show();
        $('#cluster-map-table-body').empty();
        clusterMap.forEach((cluster, index) => {
            if(cluster.cluster.elements.length <= 0 )return; //cluster has no Elements
            $('#cluster-map-table-body').append(`
                <tr>
                    <td><span class="tag" style="background-color: `+ cluster.cluster.elements[0].color +`; color:white; font-weight: bold;">`+index+`</span></td>
                    <td>`+cluster.cluster_id+`</td>
                    <td>`+Math.round(cluster.centroid)+` ms</td>
                    <td>`+cluster.duration+`<img src="style/notes-images/`+cluster.duration+`.PNG" style="height: 20px; margin-left: 20px;"></td>
                    <td>`+cluster.cluster.elements.length+`</td>
                </tr>
            `);
        });
    }

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

