//Dynamic Time Warping between MIDI note Values
//https://towardsdatascience.com/dynamic-time-warping-3933f25fcdd
import { fnScore,getUser,setSubDocument } from "../firebase";

export function score(tune,baseNotes, overlayNotes) {
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
    const user = getUser();
    const attempt = {
        "user": user.uid,
        "score": score
    }
    console.log (attempt);
    setSubDocument("tunes","scores",tune,attempt);
   })

    

}