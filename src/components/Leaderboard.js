import React, { useEffect,useState } from 'react'
import { Modal } from 'react-bootstrap'
import { getSubDocuments, getUserName } from '../firebase'
import Table from './Table';


function Leaderboard({ show, handleClose, tune }) {
    const [tuneScores, setTuneScores] = useState(false);
    const tableHeaders = [{ col: "score", title: "Score" }, { col: "userName", title: "User" }, { col: "date", title: "Date" }]
    console.log(tune);
    let scores=[]
    useEffect(() => {
        getSubDocuments("tunes", "scores", tune)

            .then(async (data) => {
                data.forEach(score =>{
                    let retobj ={
                        "score":score.score,
                        "date": score.timestamp.toDate()
                    }
                    getUserName(score.user).then(data=>{
                        retobj["userName"] = data
                    });
                    scores.push(retobj);
                });
                scores.sort((a,b) =>{
                    //TODO: SORT BY SCORE THEN DATE
                    return b.score - a.score || b.date-a.date
                })
                 scores.forEach(score =>{
                    score["date"] = score.date.toLocaleString()
                })
                console.log(scores);
                setTuneScores(scores)
            });
    }, []);
    console.log(tuneScores)
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Leaderboard
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table data={tuneScores} headers={tableHeaders} />
            </Modal.Body>
        </Modal>

    )
}

export default Leaderboard