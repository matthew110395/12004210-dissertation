//TODO
//Ultra short notes?
import { BasicPitch, outputToNotesPoly, addPitchBendsToNoteEvents, noteFramesToTime, } from "@spotify/basic-pitch";
import { render } from '@testing-library/react';
import { fnBasicPitch, fnMagenta } from "../firebase";

function combineConsecutiveNotes(notes) {
    
    notes = notes.map(({ pitchBends, amplitude, endTimeSeconds,...notes }) => {
        return notes;
    });
    notes.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds); // b - a for reverse sort
    //console.log(notes);
    let previous;
    //https://stackoverflow.com/questions/65162390/merge-consecutive-objects-inside-array-with-condition-and-update-the-merged-elem
    const combnotes = notes.reduce((comb, cur, i) => {
        cur.start_index = i;
        cur.end_index = i;
        if (!previous) {
            previous = cur;
            return comb;
        }
        if (cur.pitchMidi === previous.pitchMidi) {
            previous.durationSeconds += cur.durationSeconds;
            previous.end_index = i;
            return comb;
        }
        comb.push(previous);
        previous = cur;
        return comb;
    }, []);

    if (previous) {
        combnotes.push(previous);
    }
    //console.log(combnotes);
    return combnotes;
}


export function predictor(audioData, setNotes, noteBounding,file) {
    const t0 = performance.now();
    const mode = "magenta";
    if (mode==="local") {
        const audioCtx = new AudioContext({
            sampleRate: 22050
        });
        let arrayBuffer = audioData;
    
    
        //let audioBuffer = undefined;
        const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
        const basicPitch = new BasicPitch(model);
        audioCtx.decodeAudioData(arrayBuffer).then((audioBuffer) => {
            console.log(JSON.stringify(Array.from(audioBuffer.getChannelData(0).buffer)));
            //fnBasicPitch(JSON.stringify(audioBuffer.getChannelData(0).buffer));
            const frames = [];
            const onsets = [];
            const contours = [];
            let pct = 0;
    
            basicPitch.evaluateModel(
                audioBuffer,
                (f, o, c) => {
                    frames.push(...f);
                    onsets.push(...o);
                    contours.push(...c);
                },
                (p) => {
                    pct = p;
                },
            ).then(() => {
                const notes = noteFramesToTime(
                    addPitchBendsToNoteEvents(
                        contours,
                        outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
                    ),
                );
                console.log(notes);
    
                const combined = combineConsecutiveNotes(notes);
                const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
                const t1 = performance.now();
                console.log(`Call to Local took ${t1 - t0} milliseconds.`);
                setNotes(cleaned);
            }
    
            ).catch((error) => {
                console.error("Cannot Predict", error);
            }
    
            );
        });
    }else if (mode ==="cloud"){
        fnBasicPitch(file)
        .then(result =>{
            let notes = result.data.note_activations;
            //notes = notes.unshift(["startTimeSeconds","endTimeSeconds","pitchMIDI","amplitude","pitchBends"]);
            let noteObj = notes.map(([startTimeSeconds, endTimeSeconds, pitchMidi,amplitude, pitchBends]) => ({ startTimeSeconds, endTimeSeconds, pitchMidi,amplitude, pitchBends }));
            noteObj = noteObj.map((note) =>{
                note['durationSeconds'] = note.endTimeSeconds - note.startTimeSeconds 
                return note
            })
            const combined = combineConsecutiveNotes(noteObj);
            const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
            const t1 = performance.now();
            console.log(`Call to Basic Pitch took ${t1 - t0} milliseconds.`);
            setNotes(cleaned);
        })
    }else if(mode ==="magenta"){
        fnMagenta(file)
        .then(result =>{
            let notes = result.data.note_activations.notes;
            let noteObj=[];
            //notes = notes.unshift(["startTimeSeconds","endTimeSeconds","pitchMIDI","amplitude","pitchBends"]);
            notes.map(note => {
                let retObj={};
                retObj['startTimeSeconds'] = note.startTime;
                retObj['endTimeSeconds'] = note.endTime;
                retObj['pitchMidi'] = note.pitch;
                retObj['durationSeconds'] = note.endTime - note.startTime 
                noteObj.push(retObj); 
            });
     
            const combined = combineConsecutiveNotes(noteObj);
            const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
            const t1 = performance.now();
            console.log(`Call to Magenta took ${t1 - t0} milliseconds.`);
            setNotes(cleaned);
        })
    }

}




