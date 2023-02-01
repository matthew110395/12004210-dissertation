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
    build.link = <button onClick={() => setTune(tune.id)} key={tune.id}>View</button>
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
    <div>TuneList<br />
      {tunes && <Table headers={tableHeaders} data={tabledata} />}
    </div>
  )
}

export default TuneList