//TODO - Display Music
//Scoring of playing
//UI
//Datbase
//Auth

import  { useState, useEffect } from 'react'
import FileUpload from './fileUpload';
import {predictor} from '../utils/predictor';
import {toMusicXML} from '../utils/toXML';
import PianoRoll from './PianoRoll';


function Main(){
  const [fileBuffer, setFileBuffer] = useState();
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState();
  
  const noteBounding = {max:75, min: 53};

  

  useEffect(() => {
    setFile('testScore.xml');

        console.log(fileBuffer);
      });
      const handlePredict=  ()=>{
        console.log(fileBuffer);
        const notes = predictor(fileBuffer,setNotes,noteBounding);
      }
      const handleTransform= ()=>{
        console.log(notes);
        toMusicXML(notes);
      }

return(
    <div>
        <h1>Application</h1>
        <FileUpload getFile={setFileBuffer}/>
        <button onClick={handlePredict}>Predict</button>
        <button onClick={handleTransform}>Transform</button>
        {notes.length >0
          ?<PianoRoll notes={notes} noteBounding={noteBounding}/>
          :null
        }
        
    </div>
)
}
export default Main