//Home page
import { useState } from 'react'
import FileUpload from './fileUpload';
import PianoRoll from './PianoRoll';
import SaveTune from './SaveTune';
import { getUser } from '../firebase';

//Save New Tune if logged in
function Save({ handleSaveShow, reset }) {
  const user = getUser();
  const loggedin = !(typeof user === "undefined");
  return (
    <div>
      {loggedin &&
        <div className='d-flex justify-content-center py-3 gap-2'><button className='btn btn-primary' onClick={handleSaveShow}>Save New Tune</button><button className='btn btn-danger' onClick={reset}>Upload a new Tune</button></div>
      }
    </div>

  )
}

//Build page
function Main({ noteBounding }) {
  const [fileBuffer, setFileBuffer] = useState();
  const [notes, setNotes] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const handleSaveClose = () => setShowSave(false);
  const handleSaveShow = () => setShowSave(true);
  const reset = () => {
    setNotes([]);
  }

  return (
    <div>
      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-center text-container">
              <h1 className='text-white'>pipeTutor</h1>
            </div>
          </div>
        </div>
      </header>

      {notes.length > 0
        ? <div><PianoRoll baseNotes={notes} noteBounding={noteBounding} /><Save handleSaveShow={handleSaveShow} reset={reset} /></div>
        : <FileUpload getFile={setFileBuffer} setNotes={setNotes} noteBounding={noteBounding} />
      }
      <SaveTune showSave={showSave} handleSaveClose={handleSaveClose} notes={notes} key="Save" />
    </div>
  )
}
export default Main