//Build PianoRoll Visulisation
import React, { useEffect, useRef, useState } from 'react'

//Conditional Play Pause Button
function PlayPause({ playPause, reset }) {
	const [playing, setPlaying] = useState(false);
	const playClick = () => {
		setPlaying(!playing);
		playPause();
	}
	return (<div className='d-flex justify-content-center py-3 gap-2'>
		<button className='btn btn-primary' onClick={playClick}>{playing ? "Pause" : "Play"}</button>
		<button className='btn btn-danger' onClick={reset}>Reset</button>
	</div>
	)
}

//Build PianoRoll
function PianoRoll({ baseNotes, overlayNotes = [], noteBounding }) {
	const canvasRef = useRef(null);
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
		//Draw nones on canvas for all tunes
		baseNotes.map(note => {
			const topx = note.startTimeSeconds * noteScale;
			const topy = ((noteBounding.max - note.pitchMidi) * barHeight);
			const len = note.durationSeconds * noteScale;
			ctx.fillRect(topx - pos, topy, len, barHeight);
			return null;
		})
		ctx.stroke();
		ctx.fillStyle = 'rgb(255, 225, 0,0.5)';
		//Draw notes if playing against new tune
		overlayNotes.map(note => {
			const topx = note.startTimeSeconds * noteScale;
			const topy = ((noteBounding.max - note.pitchMidi) * barHeight);
			const len = note.durationSeconds * noteScale;
			ctx.fillRect(topx - pos, topy, len, barHeight);
			return null;
		})
		ctx.stroke();
		ctxRef.current = ctx;

	}
	//Calculate tune length whichever is longest
	if (overlayNotes.length > 0) {
		const baseLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
		const overLen = overlayNotes.at(-1).startTimeSeconds + overlayNotes.at(-1).durationSeconds;
		tuneLen = baseLen > overLen ? baseLen : overLen;
	} else {
		tuneLen = baseNotes.at(-1).startTimeSeconds + baseNotes.at(-1).durationSeconds;
	}

	useEffect(() => {
		//Set canvas width and height based on notes in tune
		const canvas = canvasRef.current;
		canvas.width = tuneLen * noteScale;
		canvas.height = barHeight * numNotes;
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
	//Scrolling canvas
	const animate = () => {
		pos++;
		requestAnimationFrame(() => {
			clear();
			draw(pos);
			if (playing && pos < (tuneLen * noteScale) - displayWidth) {
				animate()
			}
		})
	}
	//Scrolling canvas play pause
	const playPause = () => {
		displayWidth = document.getElementById("pianoRoll").clientWidth;
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