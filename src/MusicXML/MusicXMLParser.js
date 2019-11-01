const xmlConverter = require('xml-js');
window.xmlConverter = xmlConverter;

class MusicXMLParser{


    toMusicXML(){
        return xmlConverter.js2xml( this.toMusicXMLinJSON() , { compact: true, ignoreComment: true, spaces: 0} );
    }
}

module.exports = MusicXMLParser;