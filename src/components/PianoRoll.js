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
	return (<div>
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
	let tuneLen;
	const draw = (pos = 0) => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;
		//ctx.scale(2, 2);
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
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


	useEffect(() => {
		const canvas = canvasRef.current;

		if (overlayNotes.length > 0) {
			const baseLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
			const overLen = overlayNotes.at(-1).startTimeSeconds + overlayNotes.at(-1).durationSeconds;
			tuneLen = baseLen > overLen ? baseLen : overLen;
		} else {
			tuneLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
		}
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
			if (playing && pos < tuneLen * noteScale) {
				animate()
			} else {
				console.log("done");
				console.log(playing);
			}

		})


	}
	const playPause = () => {
		console.log(playing);
		playing = !playing;
		animate();
	}
	const reset = () => {
		pos = 0;

		//window.setTimeout(animate, 20);
		requestAnimationFrame(() => {
			clear();
			draw(pos);
		})
	}


	return (
		<div>

			<div className='w-75 overflow-hidden'>
				<canvas ref={canvasRef} />
			</div>

			<PlayPause playPause={playPause} reset={reset} />
		</div>

	)
}

export default PianoRoll