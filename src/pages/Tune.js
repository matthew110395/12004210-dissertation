import React,{useState,useEffect} from 'react'
import PianoRoll from '../components/PianoRoll'
import FileUpload from '../components/fileUpload';
import {score} from '../utils/score'
function Tune({selectedTune,tunes,noteBounding}) {

    const [notes, setNotes] = useState([]);
    const setTune = tunes.filter(tune=>tune.id == selectedTune);
   
    useEffect(() => {
      if (notes.length>0){
        score(selectedTune,setTune[0].notes,notes);
      }
    },[notes]);
  return (
    <div>Tune
        <FileUpload setNotes={setNotes} noteBounding={noteBounding}/>
    {setTune[0].notes.length >0
        ?<PianoRoll baseNotes={setTune[0].notes} overlayNotes={notes} noteBounding={noteBounding}/>
        :null
      }
    </div>
    
  )
}

export default Tune