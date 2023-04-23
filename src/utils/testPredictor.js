//TODO
//Ultra short notes?
import { BasicPitch, outputToNotesPoly, addPitchBendsToNoteEvents, noteFramesToTime, } from "@spotify/basic-pitch";
import { render } from '@testing-library/react';
import { fnBasicPitch, fnMagenta, fnScore } from "../firebase";

function score(baseNotes, overlayNotes) {
    return new Promise((resolve, reject) =>{
        const base_score = 1000;
   let base=[];
   let over=[];
   let score = 0
   baseNotes.forEach(note => {
    base.push([note.pitchMidi,note.durationSeconds]);
   });
   overlayNotes.forEach(note => {
    over.push([note.pitchMidi,note.durationSeconds]);
   });
   
   fnScore(base,over) 
   .then(result =>{
    if(result.data.distance <= base_score){
        score = Math.round(base_score-result.data.distance)
    }
    resolve(score);
    })
    
   })

    

}


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



export async function predictor(audioData, setNotes, noteBounding,file) {
    const baseline = [{ "startTimeSeconds":0.97, "pitchMidi": 58,"durationSeconds": 2.34},{ "startTimeSeconds":3.31, "pitchMidi": 59,"durationSeconds": 2.07},{ "startTimeSeconds":5.38, "pitchMidi": 61,"durationSeconds": 1.95},{ "startTimeSeconds":7.33, "pitchMidi": 62,"durationSeconds": 2.16},{ "startTimeSeconds":9.49, "pitchMidi": 64,"durationSeconds": 1.83},{ "startTimeSeconds":11.32, "pitchMidi": 66,"durationSeconds": 1.93},{ "startTimeSeconds":13.25, "pitchMidi": 67,"durationSeconds": 2.17},{ "startTimeSeconds":15.42, "pitchMidi": 69,"durationSeconds": 2.08},{ "startTimeSeconds":17.5, "pitchMidi": 55,"durationSeconds": 2.02},{ "startTimeSeconds":19.52, "pitchMidi": 58,"durationSeconds": 2.7}];

    let results = [];
    let lcom,ccom,mcom = false;
    
    const mode = "magenta";
    //if (mode==="local") {
        const t0l = performance.now();
        const audioCtx = new AudioContext({
            sampleRate: 22050
        });
        let arrayBuffer = audioData;
    
    
        //let audioBuffer = undefined;
        const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
        const basicPitch = new BasicPitch(model);
        audioCtx.decodeAudioData(arrayBuffer).then(async(audioBuffer) => {
            console.log(JSON.stringify(Array.from(audioBuffer.getChannelData(0).buffer)));
            //fnBasicPitch(JSON.stringify(audioBuffer.getChannelData(0).buffer));
            const frames = [];
            const onsets = [];
            const contours = [];
            let pct = 0;
    
             await basicPitch.evaluateModel(
                audioBuffer,
                (f, o, c) => {
                    frames.push(...f);
                    onsets.push(...o);
                    contours.push(...c);
                },
                (p) => {
                    pct = p;
                },
            ).then(async () => {
                const notes = noteFramesToTime(
                    addPitchBendsToNoteEvents(
                        contours,
                        outputToNotesPoly(frames, onsets),
                    ),
                );
                //console.log(notes);
    
                const combined = combineConsecutiveNotes(notes);
                const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
                const t1l = performance.now();
                //console.log(`Call to Local took ${t1l - t0l} milliseconds.`);
                
                lcom=true;
                //retVals(lcom,ccom,mcom,results);
                setNotes(cleaned);
                const sval= await score (baseline,cleaned)
                results.push(["local",sval]);
                console.log("local",sval);
            }
    
            ).catch((error) => {
                results.push(["local","ERR"]) ;
                //console.error("Cannot Predict", error);
            }
    
            );
        });
    //}else if (mode ==="cloud"){
        const t0c = performance.now();
        await fnBasicPitch(file)
        .then(async result =>{
            let notes = result.data.note_activations;
            //notes = notes.unshift(["startTimeSeconds","endTimeSeconds","pitchMIDI","amplitude","pitchBends"]);
            let noteObj = notes.map(([startTimeSeconds, endTimeSeconds, pitchMidi,amplitude, pitchBends]) => ({ startTimeSeconds, endTimeSeconds, pitchMidi,amplitude, pitchBends }));
            noteObj = noteObj.map((note) =>{
                note['durationSeconds'] = note.endTimeSeconds - note.startTimeSeconds 
                return note
            })
            const combined = combineConsecutiveNotes(noteObj);
            const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
            const t1c = performance.now();
            //console.log(`Call to Basic Pitch took ${t1c - t0c} milliseconds.`);
            const sval= await score (baseline,cleaned)
            results.push(["cloud",sval]);
            console.log("cloud",sval);
            //retVals(lcom,ccom,mcom,results);
        })
    //}else if(mode ==="magenta"){
        const t0m = performance.now();
        await fnMagenta(file)
        .then(async result =>{
            let notes = result.data.note_activations.notes;
            let noteObj=[];
            //notes = notes.unshift(["startTimeSeconds","endTimeSeconds","pitchMIDI","amplitude","pitchBends"]);
            notes.map(async note => {
                let retObj={};
                retObj['startTimeSeconds'] = note.startTime;
                retObj['endTimeSeconds'] = note.endTime;
                retObj['pitchMidi'] = note.pitch;
                retObj['durationSeconds'] = note.endTime - note.startTime 
                noteObj.push(retObj); 
            });
     
            const combined = combineConsecutiveNotes(noteObj);
            const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
            const t1m = performance.now();
            //console.log(`Call to Magenta took ${t1m - t0m} milliseconds.`);
            const sval= await score (baseline,cleaned)
            results.push(["magenta",sval]);
            console.log("magenta",sval);
        })
        .catch(err =>{
            results.push(["magenta","ERR"]) ;
        })
        //console.log("end");
        return results
    //}

}




