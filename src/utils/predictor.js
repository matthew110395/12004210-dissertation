//Call All predictor functions
import { BasicPitch, outputToNotesPoly, addPitchBendsToNoteEvents, noteFramesToTime, } from "@spotify/basic-pitch";
import { fnBasicPitch, fnMagenta } from "../firebase";

//Combine notes which are the same in series
function combineConsecutiveNotes(notes) {
    notes = notes.map(({ pitchBends, amplitude, endTimeSeconds, ...notes }) => {
        return notes;
    });
    notes.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
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
    return combnotes;
}

//Predictor functions
export function predictor(audioData, setNotes, noteBounding, file) {
    //Hard coded to use BasicPitch cloud predictor
    const mode = "cloud";
    //Local BasicPitch predictor
    if (mode === "local") {
        const audioCtx = new AudioContext({
            sampleRate: 22050
        });
        let arrayBuffer = audioData;
        //Load Model
        const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
        const basicPitch = new BasicPitch(model);
        //Decode to audio buffer before predicting
        audioCtx.decodeAudioData(arrayBuffer).then((audioBuffer) => {
            const frames = [];
            const onsets = [];
            const contours = [];
            let pct = 0;
            //Run predictor
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
                //Clean and Combine data   
                const combined = combineConsecutiveNotes(notes);
                const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
                setNotes(cleaned);
            }
            ).catch((error) => {
                console.error("Cannot Predict", error);
            }
            );
        });
    //Cloud BasicPitch predictor
    } else if (mode === "cloud") {
        //Run cloud function
        fnBasicPitch(file)
            .then(result => {
                let notes = result.data.note_activations;
                let noteObj = notes.map(([startTimeSeconds, endTimeSeconds, pitchMidi, amplitude, pitchBends]) => ({ startTimeSeconds, endTimeSeconds, pitchMidi, amplitude, pitchBends }));
                noteObj = noteObj.map((note) => {
                    note['durationSeconds'] = note.endTimeSeconds - note.startTimeSeconds
                    return note
                })
                //Clean and Combine data
                const combined = combineConsecutiveNotes(noteObj);
                const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
                setNotes(cleaned);
            })
    //Run Magenta cloud predictor
    } else if (mode === "magenta") {
        //Run cloud function
        fnMagenta(file)
            .then(result => {
                //Reformat data
                let notes = result.data.note_activations.notes;
                let noteObj = [];
                notes.map(note => {
                    let retObj = {};
                    retObj['startTimeSeconds'] = note.startTime;
                    retObj['endTimeSeconds'] = note.endTime;
                    retObj['pitchMidi'] = note.pitch;
                    retObj['durationSeconds'] = note.endTime - note.startTime
                    noteObj.push(retObj);
                    return null
                });
                //Clean and Combine
                const combined = combineConsecutiveNotes(noteObj);
                const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
                setNotes(cleaned);
            })
    }
}