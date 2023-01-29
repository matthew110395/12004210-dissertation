//https://codesandbox.io/s/gwbkt?file=/src/index.js:72-136
//https://blog.openreplay.com/2d-sketches-with-react-and-the-canvas-api
import React, { useEffect, useRef, useState  } from 'react'
import { setDocument, getUser } from '../firebase';

function PianoRoll({notes, noteBounding}) {
	
    const [drawing, setDrawing] = useState(false);
	const [tuneName,setTuneName] = useState();
	const [tuneDesc,setTuneDesc] = useState();
    const canvasRef = useRef(null);
	// Storing the context in a ref so we can use it
	// later to draw on the canvas
	const ctxRef = useRef(null);

	const noteScale=100;
	const barHeight = 20;
	const numNotes = noteBounding.max-noteBounding.min;
	
	useEffect(() => {
		const canvas = canvasRef.current;
		const tuneLen = notes.at(-1).startTimeSeconds+notes.at(-1).durationSeconds;
		canvas.width = tuneLen * noteScale;
		canvas.height = barHeight * numNotes;
		//canvas.style.width = `${window.innerWidth}px`;
		//canvas.style.height = `${window.innerHeight}px`;
		var WIDTH = canvas.width;
      	var HEIGHT = canvas.height;
		console.log(barHeight);

		// Setting the context to enable us draw
		const ctx = canvas.getContext('2d');
		//ctx.scale(2, 2);
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
		ctx.beginPath();
		let cursor = barHeight;
		while(cursor < HEIGHT){
			ctx.moveTo(0, cursor);
    		ctx.lineTo(WIDTH, cursor);
			cursor +=barHeight;
		}
    	
    	ctx.stroke();
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.fillStyle = 'rgb(225, 0, 0)';
		
		notes.map(note =>{
			const topx = note.startTimeSeconds * noteScale;
			const topy = ((noteBounding.max - note.pitchMidi)*barHeight);
			const len = note.durationSeconds *noteScale;
			console.log(topx, topy, len, barHeight)
			ctx.fillRect(topx, topy, len, barHeight) ;
		})
		ctx.stroke();
		ctxRef.current = ctx;


	}, []);

	const clear = () => {
		ctxRef.current.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
	};
	const save = () =>{
		notes.forEach(note => {
			delete note.start_index;
			delete note.end_index;
		});
		const data = {
			name:tuneName,
			notes: notes,
			description:tuneDesc,
			user: getUser().uid
		}
		console.log(data);
		setDocument("tunes",data);
	};


	
  return (
	<div>
		<button onClick={save}>Save</button>
		<label>
			Tune Name:
			<input type="text" name="name" onChange={(e) => setTuneName(e.target.value)}/>
		</label>
		<label>
			Tune Notes:
			<textarea name="description" onChange={(e) => setTuneDesc(e.target.value)}/>
		</label>
		
    <canvas ref={canvasRef}/></div>
	
  )
}

export default PianoRoll