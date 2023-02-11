//TODO - Display Music
//Scoring of playing
//UI
//Datbase
//Auth

import { useState } from 'react'
import FileUpload from './fileUpload';
import { predictor } from '../utils/predictor';
import { toMusicXML } from '../utils/toXML';
import PianoRoll from './PianoRoll';
import { logout } from "../firebase";
import SaveTune from './SaveTune';
import MusicBanner from '../images/MusicBanner.jpeg'

function Main({ noteBounding }) {
  const [fileBuffer, setFileBuffer] = useState();
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState();
  const [showSave, setShowSave] = useState(false);
  console.log(showSave);
  const handleSaveClose = () => setShowSave(false);
  const handleSaveShow = () => setShowSave(true);
  const reset = () => {
    setNotes([]);

  }

  return (
    <div>
      <header class="masthead">
        <div class="container h-100">
          <div class="row h-100 align-items-center">
            <div class="col-12 text-center">
            </div>
          </div>
        </div>
      </header>

      {notes.length > 0
        ? <div><PianoRoll baseNotes={notes} noteBounding={noteBounding} /><button className='btn btn-primary' onClick={handleSaveShow}>Save New Tune</button><button className='btn btn-danger' onClick={reset}>Upload a new Tune</button></div>
        : <FileUpload getFile={setFileBuffer} setNotes={setNotes} noteBounding={noteBounding} />
      }
      <SaveTune showSave={showSave} handleSaveClose={handleSaveClose} notes={notes} key="Save" />

    </div>
  )
}
export default Main