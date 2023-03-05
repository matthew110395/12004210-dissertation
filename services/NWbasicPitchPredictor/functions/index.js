//Function to run basicPitch within Firebase Function
const bp = require("@spotify/basic-pitch")
const functions = require("firebase-functions");
const cors = require('cors')({
    origin: true,
});
const audio = require('web-audio-api');

function combineConsecutiveNotes(notes) {
    notes = notes.map(({ pitchBends, amplitude, ...notes }) => {
        return notes;
    });
    notes.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds); // b - a for reverse sort
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

exports.basicPitchPredictor = functions.runWith({
      // Ensure the function has enough memory and time
      // to process large files
      timeoutSeconds: 300,
      memory: "1GB",
    }).https.onRequest(async (req, res) => {
    if (req.method === 'PUT') {
        res.status(403).send('Forbidden!');
        return;
    }
    cors(req, res, () => {
        try {
            const blob = req.body.data;
            //const mimeType = blob.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
            //const base64EncodedAudioString = blob.replace(/^data:audio\/\w+;base64,/, '')
            //const arrayBuffer = Buffer.from(base64EncodedAudioString, 'base64');
            
            const audioCtx = new audio.AudioContext({
                sampleRate: 22050
            });
            // 
            console.log("test")
            fetch(blob)
                .then(b => b.arrayBuffer())
                .then((buff) => {
                    //console.log(new Int8Array(buff) /* just for a view purpose */)
                    //audioCtx.decodeAudioData(buff).then((audioBuffer) => {
                    audioCtx.decodeAudioData(buff, async function(audioBuffer){
                        console.log(audioBuffer);
                        const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
                        const basicPitch = new bp.BasicPitch(model);
        
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
                        )
                        console.log("done");
                        // .then(() => {
                        //     console.log("2");
                        //     const notes = bp.noteFramesToTime(
                        //         bp.addPitchBendsToNoteEvents(
                        //             contours,
                        //             bp.outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
                        //         ),
                        //     );
        
                        //     const combined = combineConsecutiveNotes(notes);
                        //     const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
                        //     res.status(200).send({ result: cleaned, err: false });
                        // }
        
                        // ).catch((error) => {
                        //     res.status(200).send({ result: error, err: true });
                        // }
        
                        // );
                    });
            
            })
                .catch(e => console.log(e))

            
        } catch {
            res.status(401).send({ result: "ERR", err: true });
        }

    });
});