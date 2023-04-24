import React, { useState } from 'react'
import { Modal, Toast,ToastContainer } from 'react-bootstrap';
import { setDocument,getUser } from '../firebase';

function SaveTune({showSave, handleSaveClose,notes}) {
    const [tuneName, setTuneName] = useState("");
    const [tuneDesc, setTuneDesc] = useState("");
    const [errorText, setErrorText] = useState("");
    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);
    const [status, setStatus] = useState("null");
   const save = () =>{
        if(tuneName ==="" || tuneDesc ===""){
            setStatus("invalid");
            return null;
        }
		notes.forEach(note => {
			delete note.start_index;
			delete note.end_index;
		});
		const data = {
			name:tuneName,
			notes: notes,
			description:tuneDesc,
			user: getUser().uid
		}
		setDocument("tunes",data).then((ref)=>{
            if(ref ==""){
                setErrorText("Store Unsuccessful");
            }else{
                setTuneName("");
                setTuneDesc("");
                toggleShowA();
                handleSaveClose();
            }
        });
	};
    return (
        <div>
            <Modal show={showSave} onHide={handleSaveClose} key="Save">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Save Tune
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className={`mb-3 alert alert-danger ${errorText.length == 0 && 'd-none'}`} role="alert">
        {errorText}
      </div>
                    

                    <div className='mb-3'>
                        <label className='form-label' htmlFor="tuneName">Tune Name</label>
                        <input type="text" id='tuneName' className={`form-control is-${status}`} name="name" onChange={(e) => setTuneName(e.target.value)} required/>
                    </div>

                    <div className='mb-3'>
                        <label className='form-label' htmlFor="tuneDesc">Tune Notes:</label>
                        <textarea id='tuneDesc' className={`form-control is-${status}`} name="description" onChange={(e) => setTuneDesc(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-grid gap-2 col-6 mx-auto">
                        <button
                            className="btn btn-primary"
                            onClick={save}
                            type="button"
                        >        Save
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
            <ToastContainer className="p-3" position="bottom-end">
      <Toast show={showA} onClose={toggleShowA} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">{tuneName} Saved</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>Tune Saved Successfully!</Toast.Body>
        </Toast>
        </ToastContainer>
        </div>
    )
}

export default SaveTune