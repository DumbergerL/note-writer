class OSMD{
    constructor(){
        this._containerID = 'osmdContainer';

        this._osmd = new window.opensheetmusicdisplay.OpenSheetMusicDisplay( this._containerID );

    }

    renderMusicXML( musicXML ) {
        this._osmd
            .load( musicXML )
            .then( () => {
                this._osmd.render();
            });
    }
}



module.exports = new OSMD();
