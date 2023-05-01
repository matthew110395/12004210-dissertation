//Scafolding layout component
import React, { useState } from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield, faHome, faMusic } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logo.png';
import LoginReg from '../pages/Login';
import LogOut from '../pages/LogOut';
import { getUser } from '../firebase';

//Conditional login/out icon
function loginOut(userExits) {
  if (userExits) {
    return (<span><FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faUserShield} /> Log Out</span>)
  } else {
    return (<span><FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faUserShield} /> Login</span>)
  }
}

function Layout() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user = getUser();
  localStorage.setItem("user", JSON.stringify(user));
  const loggedin = !(typeof user === "undefined");
  return (
    <div>
      <header>
        <div className="px-3 py-2 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a href="/" className="d-flex align-items-center align-items-lg-left my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                <img src={logo} className="" width="70" height="70" role="img" aria-label="pipeTutor" />
              </a>

              <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                <li>
                  <NavLink to="/" className={({ isActive }) => isActive ? "active nav-link" : "nav-link text-white"}> <FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faHome} /> Home</NavLink>
                </li>

                {loggedin && <li>
                  <NavLink to="/tunes" className={({ isActive }) => isActive ? "active nav-link" : "nav-link text-white"}>
                    <FontAwesomeIcon className="bi d-block mx-auto mb-1" icon={faMusic} />
                    Tunes
                  </NavLink>
                </li>
                }
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
      {loggedin
        ? <LogOut show={show} handleClose={handleClose} />
        : <LoginReg show={show} handleClose={handleClose} />
      }


      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  )
}

export default Layout