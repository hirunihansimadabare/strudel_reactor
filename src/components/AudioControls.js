import React from 'react'

export default function AudioControls({onPlay, onStop, onPreProcess, onProcAndPlay}){
    return (
        <nav>
            <h4>Audio Controls</h4>
            <button id="process" className="btn btn-outline-primary" onClick={onPreProcess}>Preprocess</button>
            <br />
            <br />
            <button id="process_play" className="btn btn-outline-primary" onClick={onProcAndPlay}>Proc & Play</button>
            <br />
            <br />
            <button id="play" className="btn btn-outline-primary" onClick={onPlay}>Play</button>
            <br />
            <br />
            <button id="stop" className="btn btn-outline-primary" onClick={onStop}>Stop</button>
        </nav>
    );
}