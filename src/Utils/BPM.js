class BPM{

    constructor(){
        this.CLASSIFICATION_80_140 = [
            {
                type: 'whole',
                duration: 96,
                upperBound: 3000,
                lowerBound: 1710
            },
            {
                type: 'half',
                duration: 48,
                upperBound: 1500,
                lowerBound: 860
            },
            {
                type: 'quarter',
                duration: 24,
                upperBound: 750,
                lowerBound: 430
            },
            {
                type: 'eighth',
                duration: 12,
                upperBound: 380,
                lowerBound: 210
            },
            {
                type: '16th',
                duration: 6,
                upperBound: 190,
                lowerBound: 110
            }
        ];
    }

    CLASSIFY_80_90( note ){
        note.setDuration( 6 );

        console.log( note.durationTimestamp);
        
        this.CLASSIFICATION_80_140.forEach( bpmClass => {
            if(note.durationTimestamp < bpmClass.upperBound && note.durationTimestamp > bpmClass.lowerBound){
                note.setDuration( bpmClass.duration );
            }
        });
    }
}

module.exports = new BPM();