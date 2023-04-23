import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, registerWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Modal } from "react-bootstrap";

function Register({ setMode, email, setEmail, password, setPassword, name, setName }) {


  const toLogin = () => {
    setMode("Login")
  }

  return (
    <div className="w-100 p-3">
      <div className="mb-3">
        <label for="fName" className="form-label">Full Name</label>

        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          id="fName"
        />
      </div>

      <div className="mb-3">
        <label for="email" className="form-label">E-mail Address</label>
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
        Already have an account? <a onClick={toLogin} href="#">Login</a> now.
      </div>
      <hr></hr>
      <button className="w-100 btn btn-lg btn-outline-primary" onClick={signInWithGoogle}>
        <span class="google_icon"></span>
        <span class="buttonText">Sign in with Google</span>
      </button>


    </div>
  )
}

function Login({ handleClose, setMode, email, setEmail, password, setPassword }) {
  const navigate = useNavigate();
  const toReg = () => {
    setMode("Register")
  }
  return (

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
        Don't have an account? <a onClick={toReg} href="#">Register</a> now.
      </div>

      <hr></hr>
      <button className="w-100 btn btn-lg btn-outline-primary" onClick={signInWithGoogle}>
        <span class="google_icon"></span>
        <span class="buttonText">Sign in with Google</span>
      </button>
      <div>

      </div>

    </div>
  )
}

function LoginReg({ show, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("Login")
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
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
          {mode === "Login"
            ? "Login"
            : "Register"
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode === "Login" &&
          <Login handleClose={handleClose} setMode={setMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} />
        }
        {mode === "Register" &&
          <Register handleClose={handleClose} setMode={setMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
        }

      </Modal.Body>
      <Modal.Footer>

        {mode === "Login" &&
          <div class="d-grid gap-2 d-md-block">
            <Link to="/reset" className="btn btn-secondary">Forgotten Password</Link>
            <button
              className="btn btn-primary"
              onClick={() => logInWithEmailAndPassword(email, password)}
            >        Login
            </button>
          </div>
        }
        {mode === "Register" &&
          <div class="d-grid gap-2 d-md-block">
            <button className="btn btn-primary" onClick={register}> Register
            </button>
          </div>


        }
      </Modal.Footer>
    </Modal>
  );
}

export default LoginReg