import React, { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Main from './components/main';
import Login from './components/Login';
import Layout from './components/Layout';
import Register from './components/Register';
function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Main />} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
