import  { useState, useEffect } from 'react'
import FileUpload from './fileUpload';
import {predictor} from '../utils/predictor';


function Main(){
    const [fileBuffer, setFileBuffer] = useState();
      useEffect(() => {
        console.log(fileBuffer);
      });
      const handlePredict= ()=>{
        console.log(fileBuffer);
        predictor(fileBuffer);
      }

return(
    <div>
        <h1>Application</h1>
        <FileUpload getFile={setFileBuffer}/>
        <button onClick={handlePredict}>Predict</button>

    </div>
)
}
export default Main