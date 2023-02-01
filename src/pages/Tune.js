import React,{useState} from 'react'
import PianoRoll from '../components/PianoRoll'
import FileUpload from '../components/fileUpload';
function Tune({selectedTune,tunes,noteBounding}) {

    const [notes, setNotes] = useState([]);
    const setTune = tunes.filter(tune=>tune.id == selectedTune);
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