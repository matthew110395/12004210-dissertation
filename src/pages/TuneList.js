import React, { useState, useEffect } from 'react'
import { where } from 'firebase/firestore'
import { getDocuments, getUser } from '../firebase'
import Table from '../components/Table';
import { useNavigate } from "react-router-dom";
import Share from './Share';
import {Toast,ToastContainer} from 'react-bootstrap';

function TuneList({ tunes, setTunes,shareTunes,setShareTunes, setselectedTune }) {
  const navigate = useNavigate();
  const [shareTune,setShareTune] = useState();
  const [show, setShow] = useState(false);
 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  const tableHeaders = [{ col: "name", title: "Name" }, { col: "description", title: "Notes" }, { col: "link", title: "" }];

  const tabledata = tunes.map((tune) => {
    let build = tune;
    build.link = <div><button className='btn btn-secondary' onClick={() => setTune(tune.id)} key={`${tune.id}_View`}>View</button><button className='btn btn-primary' onClick={() => share(tune.id)} key={`${tune.id}_Share`}>Share</button></div>
    return build;
  });
  const shareTabledata = shareTunes.map((tune) => {
    let build = tune;
    build.link = <div><button className='btn btn-secondary' onClick={() => setTune(tune.id)} key={`${tune.id}_View`}>View</button></div>
    return build;
  });

  useEffect(() => {
    const query = where("user", "==", getUser().uid);
    getDocuments("tunes", query)
      .then(data => {
        setTunes(data);
      })
      const shareQuery = where("sharedWith", "array-contains", getUser().uid);
    getDocuments("tunes", shareQuery)
      .then(data => {
        setShareTunes(data);
      });
  }, []);
  const setTune = (tune) => {
    const allTunes = tunes.concat(shareTunes);
    const tuneData = allTunes.filter(allTunes => allTunes.id == tune);
    console.log(allTunes,tuneData)
    setselectedTune(tuneData)
    navigate('/tune');
  };
  const share = (tune) =>{
    setShareTune(tune);
    handleShow();
  }
  return (
    <div>
    <Share show={show} handleClose={handleClose} tune={shareTune} />
    <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-center text-container">
              <h1 className='text-white'>Tunes</h1>
            </div>
          </div>
        </div>
      </header>
      {tunes && <div><h2 className='text-white'>My Tunes</h2><Table headers={tableHeaders} data={tabledata} addClass={"table-dark"} /></div>}
      {shareTunes.length >0 && <div><h2 className='text-white'>Shared Tunes</h2><Table headers={tableHeaders} data={shareTabledata} addClass={"table-dark"} /></div>}
     
    </div>
  )
}

export default TuneList