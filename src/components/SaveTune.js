import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { setDocument,getUser } from '../firebase';

function SaveTune({showSave, handleSaveClose,notes}) {
    const [tuneName, setTuneName] = useState();
    const [tuneDesc, setTuneDesc] = useState();

   const save = () =>{
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
		console.log(data);
		setDocument("tunes",data);
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

                    

                    <div className='mb-3'>
                        <label className='form-label' htmlFor="tuneName">Tune Name</label>
                        <input type="text" id='tuneName' className='form-control' name="name" onChange={(e) => setTuneName(e.target.value)} required/>
                    </div>

                    <div className='mb-3'>
                        <label className='form-label' htmlFor="tuneDesc">Tune Notes:</label>
                        <textarea id='tuneDesc' className='form-control' name="description" onChange={(e) => setTuneDesc(e.target.value)} />
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
        </div>
    )
}

export default SaveTune