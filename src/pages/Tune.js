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
  console.log(setTune);
  useEffect(() => {
    if (notes.length > 0) {
      score(selectedTune, setTune[0].notes, notes);
    }
  }, [notes]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (

    <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button className="btn btn-primary me-md-2" onClick={handleShow} type="button"><FontAwesomeIcon icon={faShieldHalved} /> Leaderboard</button></div>

      <Leaderboard show={show} handleClose={handleClose} tune={setTune[0].id} />
      <FileUpload setNotes={setNotes} noteBounding={noteBounding} />
      {setTune[0].notes.length > 0
        ? <PianoRoll baseNotes={setTune[0].notes} overlayNotes={notes} noteBounding={noteBounding} />
        : null
      }
    </div>

  )
}

export default Tune