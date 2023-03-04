//Function to run basicPitch within Firebase Function
const bp = require("@spotify/basic-pitch")
const functions = require("firebase-functions");

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

exports.basicPitchPredictor = functions.https.onRequest(async (request, response) => {
    let audioBuffer = undefined;
    const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
    const basicPitch = new bp.BasicPitch(model);

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
        const notes = bp.noteFramesToTime(
            bp.addPitchBendsToNoteEvents(
                contours,
                bp.outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
            ),
        );

        const combined = combineConsecutiveNotes(notes);
        const cleaned = combined.filter(note => note.pitchMidi > noteBounding.min && note.pitchMidi < noteBounding.max);
        response.json({ result: cleaned, err: false })
    }

    ).catch((error) => {
        response.json({ result: error, err: true })
    }

    );
});