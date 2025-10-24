import React from 'react'

export default function AudioControls({onPlay, onStop, onPreProcess, onProcAndPlay}){
    return (
        <nav>
            <button id="process" className="btn btn-primary" onClick={onPreProcess}>Preprocess</button>
            <button id="process_play" className="btn btn-primary" onClick={onProcAndPlay}>Proc & Play</button>
            <br />
            <button id="play" className="btn btn-primary" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-primary" onClick={onStop}>Stop</button>
        </nav>
    );
}