import React, { useState,useEffect } from 'react'
import { Modal,Toast,ToastContainer } from 'react-bootstrap'
import { where } from 'firebase/firestore'
import { getDocuments,addArray } from '../firebase'

function Share({ show, handleClose,tune }) {
    const [email, setEmail] = useState();
    const [userName, setUserName] = useState();
    const [user, setUser] = useState();
    const [status, setStatus] = useState("null");
    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);

    useEffect(() => {
        if(email !== undefined){
            const query = where("email", "==", email);
            getDocuments("users", query)
              .then(data => {
                if (data.length >0){
                    setUserName(data[0].name);
                    setUser(data[0].uid);
                    setStatus("valid");
                }else{
                    setUserName("User Not Found");
                    setStatus("invalid")
                }
              })
        }
        
    },[email]);

    const share = () =>{
        addArray("tunes",tune,"sharedWith",user)
        setEmail("");
        handleClose();
        toggleShowA();
    }
    
    return (
        <div>
 <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Share Tune
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="w-100 p-3">

                    <div className="mb-3">
                        <label for="email" className="form-label">Email address</label>
                        <input
                            type="text"
                            className={`form-control is-${status}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail Address"
                            id="email"
                        />
                        <div className={`${status}-feedback`}>{userName}</div>
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                    <div class="d-grid gap-2 d-md-block">
                        {status ==="valid"
                        ?<button className="btn btn-primary" onClick={share}>Share</button>
                        :<button className="btn btn-primary" disabled>Share</button>
                        }
                        
                    </div>

            </Modal.Footer>
        </Modal>
         <ToastContainer className="p-3" position="bottom-end">
      <Toast show={showA} onClose={toggleShowA} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Shared</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>Tune Shared Successfully!</Toast.Body>
        </Toast>
        </ToastContainer>
        </div>
       
    )
}

export default Share