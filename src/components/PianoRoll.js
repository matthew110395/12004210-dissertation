//https://codesandbox.io/s/gwbkt?file=/src/index.js:72-136
//https://blog.openreplay.com/2d-sketches-with-react-and-the-canvas-api
import { render } from '@testing-library/react';
import React, { useEffect, useRef, useState } from 'react'

function PlayPause({ playPause, reset }) {
	const [playing, setPlaying] = useState(false);
	const playClick = () => {
		setPlaying(!playing);
		playPause();
	}
	return (<div className='d-flex justify-content-center py-3'>
		<button className='btn btn-primary' onClick={playClick}>{playing ? "Pause" : "Play"}</button>
		<button className='btn btn-danger' onClick={reset}>Reset</button>
	</div>
	)
}


function PianoRoll({ baseNotes, overlayNotes = [], noteBounding }) {
	const [drawing, setDrawing] = useState(false);
	const [tuneName, setTuneName] = useState();
	const [tuneDesc, setTuneDesc] = useState();

	const canvasRef = useRef(null);
	// Storing the context in a ref so we can use it
	// later to draw on the canvas
	const ctxRef = useRef(null);
	let playing = false;
	const noteScale = 100;
	const barHeight = 20;
	const numNotes = noteBounding.max - noteBounding.min;
	let pos = 0;
	let tuneLen, displayWidth;
	const draw = (pos = 0) => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;
		//ctx.scale(2, 2);
		ctx.strokeStyle = 'rgb(192, 192, 192)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		let cursor = barHeight;
		while (cursor < HEIGHT) {
			ctx.moveTo(0, cursor);
			ctx.lineTo(WIDTH, cursor);
			cursor += barHeight;
		}

		ctx.stroke();
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.fillStyle = 'rgb(225, 0, 0)';

		baseNotes.map(note => {
			const topx = note.startTimeSeconds * noteScale;
			const topy = ((noteBounding.max - note.pitchMidi) * barHeight);
			const len = note.durationSeconds * noteScale;
			//console.log(topx, topy, len, barHeight)
			ctx.fillRect(topx - pos, topy, len, barHeight);
		})
		ctx.stroke();
		ctx.fillStyle = 'rgb(255, 225, 0,0.5)';
		overlayNotes.map(note => {
			const topx = note.startTimeSeconds * noteScale;
			const topy = ((noteBounding.max - note.pitchMidi) * barHeight);
			const len = note.durationSeconds * noteScale;
			//console.log(topx, topy, len, barHeight)
			ctx.fillRect(topx - pos, topy, len, barHeight);
		})
		ctx.stroke();
		ctxRef.current = ctx;

	}
	if (overlayNotes.length > 0) {
		const baseLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
		const overLen = overlayNotes.at(-1).startTimeSeconds + overlayNotes.at(-1).durationSeconds;
		tuneLen = baseLen > overLen ? baseLen : overLen;
	} else {
		tuneLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
	}

	useEffect(() => {
		const canvas = canvasRef.current;

		/* if (overlayNotes.length > 0) {
			const baseLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
			const overLen = overlayNotes.at(-1).startTimeSeconds + overlayNotes.at(-1).durationSeconds;
			tuneLen = baseLen > overLen ? baseLen : overLen;
		} else {
			tuneLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
		} */
		console.log(tuneLen);
		canvas.width = tuneLen * noteScale;
		canvas.height = barHeight * numNotes;
		//canvas.style.width = `${window.innerWidth}px`;
		//canvas.style.height = `${window.innerHeight}px`;

		// Setting the context to enable us draw
		const ctx = canvas.getContext('2d');
		ctxRef.current = ctx;




		draw()
		

	}, [overlayNotes]);
	const clear = () => {
		ctxRef.current.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
	};
	const animate = () => {
		pos++;
		console.log(playing);
		//window.setTimeout(animate, 20);
		requestAnimationFrame(() => {
			clear();
			draw(pos);
			console.log(playing,pos,(tuneLen * noteScale) - displayWidth)
			if (playing && pos < (tuneLen * noteScale) - displayWidth) {
				animate()
			} else {
				console.log("done");

			}

		})


	}
	const playPause = () => {
		displayWidth = document.getElementById("pianoRoll").clientWidth;

		console.log(playing);
		playing = !playing;
		animate();
	}
	const reset = () => {
		pos = 0;
		requestAnimationFrame(() => {
			clear();
			draw(pos);
		})
	}


	return (
		<div className='mt-2'>
			<PlayPause playPause={playPause} reset={reset} />
			<div className='d-flex justify-content-center'>
				<div className='w-75 overflow-hidden border border-2 rounded' id='pianoRoll'>
					<canvas ref={canvasRef} />
				</div>
			</div>
		</div>


	)
}

export default PianoRoll