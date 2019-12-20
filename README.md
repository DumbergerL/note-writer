# MIDI Piano Trainer

## Basic Structure

- MIDIController (controlls communication with midi-board and events)
- MIDISong (represents a song [maybe parsed from MusicXML] to be played from the Piano - can also be played on piano)
- MusicXMLParser (parses the MusicXML Files)
- 

## JavaScript Global Objekt / Divisions

| Source File | Dist File | Global Objects |
| ----------- | --------- | -------------- |
| `src\index.js` | `note-writer.js` | `STREAM`,`PROCESSOR`, `PIANO` |
| `src\UI\PianoRole\index.js` | `piano-role.js` | `PIANO_ROLE` |
| `src\UI\UI.js` | `ui.js` | - |