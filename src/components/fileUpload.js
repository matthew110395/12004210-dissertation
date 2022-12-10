import React, { useState } from 'react'

function FileUpload({getFile}) {
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {

        setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = (event) => {
        if(isFilePicked){
            const reader = new FileReader();
            reader.onload = (e) =>{
                const {result} = e.target;
                getFile(result);
            }
            reader.readAsArrayBuffer(selectedFile);
        }
        
	};
    return (
        <div>
            <h2>Upload File</h2>
            <input type="file" name="file" onChange={changeHandler} />
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
      
}

export default FileUpload
