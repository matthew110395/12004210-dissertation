import React, { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';
import logo from './logo.svg';
import './App.css';
import Main from './components/main';
import Login from './pages/Login';
import Layout from './components/Layout';
import Register from './pages/Register';
import TuneList from './pages/TuneList';
import Tune from './pages/Tune';
import Test from './pages/Test';
function App() {
  //const [user,setUser] = useState();
  const [tunes,setTunes] = useState([]);
  const [shareTunes,setShareTunes] = useState([]);
  const [selectedTune,setselectedTune] = useState();
  const [user, loading, error] = useAuthState(auth);
  const noteBounding = {max:75, min: 53};
  return (
    <div>

      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Main noteBounding={noteBounding}/>} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="tunes" element={<TuneList tunes={tunes} setTunes={setTunes} shareTunes={shareTunes}  setShareTunes={setShareTunes} setselectedTune={setselectedTune}/>} />
          <Route exact path="tune" element={<Tune selectedTune={selectedTune} tunes={tunes} noteBounding={noteBounding} />} />
          <Route exact path='test'element={<Test noteBounding={noteBounding}/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
