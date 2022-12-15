import  { useState, useEffect } from 'react'
import FileUpload from './fileUpload';
import {predictor} from '../utils/predictor';
import {toMusicXML} from '../utils/toXML'


function Main(){
  const [fileBuffer, setFileBuffer] = useState();
  const [notes, setNotes] = useState();

  useEffect(() => {
        console.log(fileBuffer);
      });
      const handlePredict=  ()=>{
        console.log(fileBuffer);
        const notes = predictor(fileBuffer,setNotes);
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
    </div>
)
}
export default Main