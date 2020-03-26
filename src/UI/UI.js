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
        visualizeClusterMap(PROCESSOR._map);
        window.PIANO_ROLE.visualizeNotes( window.PROCESSOR.notes );
    });

    $('#process-kmeans').click( () => {
        window.PROCESSOR.processNoteDurationKMEANS();
        visualizeClusterMap(PROCESSOR._map);
        window.PIANO_ROLE.visualizeNotes( window.PROCESSOR.notes );
    });

    function visualizeClusterMap( clusterMap ){
        console.log("THE CLUSTERMAP:", clusterMap);
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

