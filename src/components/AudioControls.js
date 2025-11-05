import React from 'react'

// AudioControls.jsx
export default function AudioControls({ onPlay, onStop, onPreProcess, onProcAndPlay }) {
    return (
      <div className="audio-grid-2x2">
        <button type="button" className="btn" onClick={onPreProcess}>Preprocess</button>
        <button type="button" className="btn" onClick={onProcAndPlay}>Proc & Play</button>
        <button type="button" className="btn" onClick={onPlay}>Play</button>
        <button type="button" className="btn" onClick={onStop}>Stop</button>
      </div>
    );
  }
  