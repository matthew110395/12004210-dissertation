//Application Launch PointerEvent, contains all routing
import React, { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';
import './App.css';
import Main from './components/main';
import Login from './pages/Login';
import Layout from './components/Layout';
import TuneList from './pages/TuneList';
import Tune from './pages/Tune';
import Test from './pages/Test';
function App() {
  const [shareTunes, setShareTunes] = useState([]);
  const [selectedTune, setselectedTune] = useState();
  useAuthState(auth);

  const noteBounding = { max: 75, min: 53 };
  return (
    <div>

      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Main noteBounding={noteBounding} />} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="tunes" element={<TuneList shareTunes={shareTunes} setShareTunes={setShareTunes} setselectedTune={setselectedTune} />} />
          <Route exact path="tune" element={<Tune selectedTune={selectedTune} noteBounding={noteBounding} />} />
          <Route exact path='test' element={<Test noteBounding={noteBounding} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
