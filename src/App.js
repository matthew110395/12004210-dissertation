import React, { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Main from './components/main';
import Login from './pages/Login';
import Layout from './components/Layout';
import Register from './pages/Register';
import TuneList from './pages/TuneList';
import Tune from './pages/Tune';
function App() {
  const [user,setUser] = useState();
  const [tunes,setTunes] = useState([]);
  const [selectedTune,setselectedTune] = useState();
  console.log(selectedTune);
  const noteBounding = {max:75, min: 53};
  return (
    <div>

      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Main />} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="tunes" element={<TuneList tunes={tunes} setTunes={setTunes} setselectedTune={setselectedTune}/>} />
          <Route exact path="tune" element={<Tune selectedTune={selectedTune} tunes={tunes} noteBounding={noteBounding} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
