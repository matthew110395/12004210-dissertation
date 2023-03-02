import React, { useState, useEffect, } from 'react'
import { useLocation } from 'react-router-dom';
import PianoRoll from '../components/PianoRoll'
import FileUpload from '../components/fileUpload';
import Leaderboard from '../components/Leaderboard';
import { score } from '../utils/score'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { getUser, getSubDocuments } from '../firebase';
function Tune({ selectedTune, tunes, noteBounding }) {

  const [notes, setNotes] = useState([]);
  const [scoreVal, setScoreVal] = useState();
  const [highScore, setHighScore] = useState();
  const user = getUser();
  //const setTune = tunes.filter(tune => tune.id == selectedTune);
  const setTune = selectedTune;
  useEffect(() => {
    getHighScore();
    if (notes.length > 0) {
      score(selectedTune[0].id, setTune[0].notes, notes)
        .then(score => {
          setScoreVal(score);
        });

    }
  }, [notes]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const reset = () => {
    setNotes([]);
  }

  const getHighScore = () => {
    getSubDocuments("tunes", "scores", selectedTune[0].id)
      .then(async (data) => {
        const ownScore = data.filter(score => score.user === user.uid);
        if (ownScore.length >0){
          ownScore.sort((a, b) => {
            //SORT BY SCORE THEN DATE
            return b.score - a.score
          });
          setHighScore(ownScore[0].score);
        }
       
      });
  }
  return (

    <div>
      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-center text-container">
              <h1 className='text-white'>{setTune[0].name}</h1>
              <p class="lead text-white">
                {setTune[0].description}
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button className="btn btn-primary me-md-2" onClick={handleShow} type="button"><FontAwesomeIcon icon={faShieldHalved} /> Leaderboard</button></div>
    {highScore && <span className='text-white'>Your High Score: {highScore}</span>}
      <Leaderboard show={show} handleClose={handleClose} tune={setTune[0].id} score={scoreVal}/>
      {notes.length === 0
        ? <FileUpload setNotes={setNotes} noteBounding={noteBounding} />
        : <div><span className='text-white'>You Scored {scoreVal}</span><button className='btn btn-secondary' onClick={reset}>Play Again</button></div>}
      {setTune[0].notes.length > 0
        ? <div><PianoRoll baseNotes={setTune[0].notes} overlayNotes={notes} noteBounding={noteBounding} /></div>
        : null
      }
      
    </div>

  )
}

export default Tune