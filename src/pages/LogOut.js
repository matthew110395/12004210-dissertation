import React from 'react'
import { Modal } from 'react-bootstrap'
import { logout } from "../firebase";

function LogOut({show, handleClose}) {
  return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Log Out
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to Log Out
    </Modal.Body>
    <Modal.Footer>
    <button className='btn btn-secondary' onClick={()=>{
            handleClose();
        }}>Exit</button>
        <button className='btn btn-warning' onClick={()=>{
            logout();
            handleClose();
        }}>Log Out</button>
    </Modal.Footer>
    </Modal>
  )
}

export default LogOut