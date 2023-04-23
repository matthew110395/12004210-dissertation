import React,{useState} from 'react'
import { predictor } from '../utils/testPredictor';
import audio from "../testData/recording-file.mp3"
function retnul(){
    return null
}


function Test({noteBounding}) {
    const [file,setFile] = useState();
    const [rep, setRep] = useState();
    const results =[];
    let reader = new FileReader();
    let reader1 = new FileReader();
    let i=0;
    reader.onloadend =  async (e) => {
        console.log(i);
        const { result } = e.target;
        const res = await predictor(result, retnul, noteBounding, file);
       results.push(res);
       if(i<rep){
         reader1.readAsArrayBuffer(file);
        i++;
    }else{
        console.log(results);
    }
    }
    reader1.onloadend =  async (e) => {
        const { result } = e.target;
        const res = await predictor(result, retnul, noteBounding, file);
       results.push(res);
       if(i<rep){
         reader.readAsArrayBuffer(file);
        i++;
    }
    else{
        console.log(results);
    }
    }
    
    const changeFile = (e) =>{
        setFile(e.target.files[0])
    }
    const changeRep = (e) =>{
        setRep(e.target.value)
    }
    const run = async() =>{

            await reader.readAsArrayBuffer(file);

        console.log("Done");
    }
  return (
    <div>
        <input type="text" onChange={changeRep} />
        <input type="file" onChange={changeFile} />
        <button onClick={run}>Go</button>
    </div>
  )
}

export default Test