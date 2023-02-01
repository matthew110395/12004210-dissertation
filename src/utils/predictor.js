//TODO
//Ultra short notes?
import { BasicPitch, outputToNotesPoly, addPitchBendsToNoteEvents, noteFramesToTime,  } from "@spotify/basic-pitch";
import { render } from '@testing-library/react';


function combineConsecutiveNotes(notes){
    console.log(notes);
    notes= notes.map(({pitchBends,amplitude, ...notes})=>{
        return notes;
    });
    notes.sort((a,b) => a.startTimeSeconds - b.startTimeSeconds); // b - a for reverse sort
    let previous;
    //https://stackoverflow.com/questions/65162390/merge-consecutive-objects-inside-array-with-condition-and-update-the-merged-elem
    const combnotes = notes.reduce((comb, cur, i) => {
        cur.start_index = i;
        cur.end_index = i;
        if (!previous) {
          previous = cur;
          return comb;
        }
        if(cur.pitchMidi === previous.pitchMidi){
            previous.durationSeconds += cur.durationSeconds;
            previous.end_index = i;
            return comb;
        }
        comb.push(previous);
        previous = cur;
        return comb;
    },[]);

    if (previous){
        combnotes.push(previous);
    }
    console.log(combnotes);
    return combnotes;
}

export function predictor(audioData,setNotes,noteBounding) {
    console.log(audioData);
    const audioCtx = new AudioContext({
        sampleRate: 22050
        });
    let arrayBuffer = audioData;
 

    //let audioBuffer = undefined;
    const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
    const basicPitch = new BasicPitch(model);
console.log(basicPitch);
    audioCtx.decodeAudioData(arrayBuffer, function (audioBuffer) {
        console.log(audioBuffer);
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

            const combined = combineConsecutiveNotes(notes);
            const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
            console.log(cleaned);
            setNotes(cleaned);
        }

        ).catch((error)=>{
            console.error("Cannot Predict",error);
        }

        );
    });


    // //   };
    // //   oReq.send();

    // //TESTING ONLY
    // //const testAudio = FileAttachment('https://raw.githubusercontent.com/spotify/basic-pitch-ts/main/test_data/C_major.resampled.mp3');


}




