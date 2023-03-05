import React, { useState, useEffect } from 'react'
import { predictor } from '../utils/predictor';
//import { fnBasicPitch } from '../firebase';

function FileUpload({ setNotes, noteBounding }) {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {

        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);

    };

    const handleSubmission = (event) => {
        if (isFilePicked) {
            //fnBasicPitch(selectedFile);
            const reader = new FileReader();
            const readerBlob = new FileReader();
            reader.onload = (e) => {
                const { result } = e.target;
                
                predictor(result, setNotes, noteBounding,selectedFile);
            }
            readerBlob.onload = (e) =>{
                const { result } = e.target;
               // fnBasicPitch(result);
            }
            reader.readAsArrayBuffer(selectedFile);
            readerBlob.readAsDataURL(selectedFile);
        }

    };
    useEffect(() => {
        handleSubmission();
    }, [selectedFile]);
    return (
        <div>
            <div className="file-upload">
                <div className={isFilePicked ? "d-flex justify-content-center" : "d-none"}>
                    <div className={isFilePicked ? "spinner-border text-light pr-5" : "d-none"}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h2 className='text-white ms-2'>&nbsp; Predicting...</h2>
                </div>


                <div className={!isFilePicked ? "image-upload-wrap" : "d-none"}>
                    <input className="file-upload-input" type='file' onChange={changeHandler} accept="audio/*" />
                    <div className="drag-text">
                        <h3>Drag and drop an audio file or click to select a file</h3>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default FileUpload
