import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Modal } from "react-bootstrap";

function Login({ show, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    //if (user) navigate("/");
    if (user) handleClose()
  }, [user, loading]);
  return (

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>




        <div className="w-100 p-3">

          <div className="mb-3">
            <label for="email" className="form-label">Email address</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
              id="email"
            />
          </div>
          <div className="mb-3">
            <label for="pass" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              id="pass"
            />
          </div>
          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>

          <hr></hr>
          <button className="w-100 btn btn-lg btn-outline-primary" onClick={signInWithGoogle}>
            <span class="google_icon"></span>
            <span class="buttonText">Sign in with Google</span>
          </button>
          <div>

          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <div class="d-grid gap-2 d-md-block">
          <Link to="/reset" className="btn btn-secondary">Forgoten Password</Link>
          &nbsp;
          <button
            className="btn btn-primary"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >        Login
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default Login