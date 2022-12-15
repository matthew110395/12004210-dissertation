//TODO
//Combine notes

import { BasicPitch, outputToNotesPoly, addPitchBendsToNoteEvents, noteFramesToTime,  } from "@spotify/basic-pitch";
import { render } from '@testing-library/react';
function combineConsecutiveNotes(notes){
    console.log(notes);
    notes.sort((a,b) => a.startTimeSeconds - b.startTimeSeconds); // b - a for reverse sort
    console.log(notes);
    //Combine consecutive notes
}
export function predictor(audioData,setNotes) {
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
            console.log(frames);
            const notes = noteFramesToTime(
                addPitchBendsToNoteEvents(
                    contours,
                    outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
                ),
            );
            //console.log(notes);
            combineConsecutiveNotes(notes);
            setNotes(notes);
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




