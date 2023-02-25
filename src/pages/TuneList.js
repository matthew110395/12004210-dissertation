import React, { useState, useEffect } from 'react'
import { where } from 'firebase/firestore'
import { getDocuments, getUser } from '../firebase'
import Table from '../components/Table';
import { useNavigate } from "react-router-dom";


function TuneList({ tunes, setTunes, setselectedTune }) {
  const navigate = useNavigate();

  const tableHeaders = [{ col: "name", title: "Name" }, { col: "description", title: "Notes" }, { col: "link", title: "" }];

  const tabledata = tunes.map((tune) => {
    let build = tune;
    build.link = <div><button className='btn btn-secondary' onClick={() => setTune(tune.id)} key={tune.id}>View</button><button className='btn btn-primary'  key={`${tune.id}_Share`}>Share</button></div>
    return build;
  });

  useEffect(() => {
    const query = where("user", "==", getUser().uid);
    getDocuments("tunes", query)
      .then(data => {
        setTunes(data);
      });
  }, []);
  const setTune = (tune) => {
    setselectedTune(tune)
    navigate('/tune');
  };
  return (
    <div>
    <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-center text-container">
              <h1 className='text-white'>My Tunes</h1>
            </div>
          </div>
        </div>
      </header>
      {tunes && <Table headers={tableHeaders} data={tabledata} addClass={"table-dark"} />}
    </div>
  )
}

export default TuneList