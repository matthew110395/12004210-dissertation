//TODO - Add conditional Login/Out
import React,{useState} from 'react';
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield, faHome, faMusic } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logo.png';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LoginReg from '../pages/Login';
import LogOut from '../pages/LogOut';
import Register from '../pages/Register';
import { getUser } from '../firebase';

function loginOut(userExits){
  if(userExits){
   return(<span><FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faUserShield} /> Login</span>)
  }else{
    return( <span><FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faUserShield} /> Log Out</span>)
  }
  
}

function Layout() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user = getUser();
  console.log(user);
  const loggedin = (typeof user === "undefined");
  return (


    <div>
      {loggedin
      ? <LoginReg show={show} handleClose={handleClose} />
    : <LogOut show={show} handleClose={handleClose} />
    }

      <header>
        <div className="px-3 py-2 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a href="/" className="d-flex align-items-center align-items-lg-left my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                <img src={logo} className="" width="70" height="70" role="img" aria-label="pipeTutor" />
              </a>

              <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                <li>
                  <Link to="/" className='nav-link active'> <FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faHome} /> Home</Link>
                </li>
                
                <li>
                  <Link to="/tunes" className='nav-link text-white'>
                    <FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faMusic} />
                    Tunes
                  </Link>
                </li>
                
                <li>
                  <a 
                   className='nav-link text-white'
                   onClick={handleShow}
                   >
                    {loginOut(loggedin)} 
                    </a>               
                </li>

                
              </ul>
            </div>
          </div>
        </div>
       
      </header>



      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  )
}

export default Layout