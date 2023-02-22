import React, { useState, useEffect } from 'react'
import PianoRoll from '../components/PianoRoll'
import FileUpload from '../components/fileUpload';
import Leaderboard from '../components/Leaderboard';
import { score } from '../utils/score'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
function Tune({ selectedTune, tunes, noteBounding }) {

  const [notes, setNotes] = useState([]);
  const setTune = tunes.filter(tune => tune.id == selectedTune);
  let scoreVal
  console.log(setTune);
  useEffect(() => {
    console.log("render");
    if (notes.length > 0) {
      scoreVal = score(selectedTune, setTune[0].notes, notes);
    }
  }, [notes]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const reset = () =>{
    setNotes([]);
    console.log(notes);
  }
  return (

    <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button className="btn btn-primary me-md-2" onClick={handleShow} type="button"><FontAwesomeIcon icon={faShieldHalved} /> Leaderboard</button></div>

      <Leaderboard show={show} handleClose={handleClose} tune={setTune[0].id} />
      {notes.length === 0 
      ? <FileUpload setNotes={setNotes} noteBounding={noteBounding} />
      :<span>You Scored {score}</span>}
      {setTune[0].notes.length > 0
        ? <div><PianoRoll baseNotes={setTune[0].notes} overlayNotes={notes} noteBounding={noteBounding} /> <button onClick={reset}>Play Again</button></div>
        : null
      }
    </div>

  )
}

export default Tune