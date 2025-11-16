import React from 'react';

export default function AudioControls({
  onPlay,
  onStop,
  onPreProcess,
  onProcAndPlay,
  volume,
  setVolume,
  speed,
  setSpeed,
}) {
  
  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol); // update React state
  };

  const handleSpeedChange = (e) => {
    const s = Number(e.target.value);
    setSpeed(s); // update React state
  };

  return (
    <div className="audio-grid-wrapper">
      {/* 2x2 button grid */}
      <div className="audio-grid-2x2 mb-3">
        <button type="button" className="btn" onClick={onPreProcess}>Preprocess</button>
        <button type="button" className="btn" onClick={onProcAndPlay}>Proc & Play</button>
        <button type="button" className="btn" onClick={onPlay}>Play</button>
        <button type="button" className="btn" onClick={onStop}>Stop</button>
      </div>
    <br />
      {/* Volume slider section */}
      <div className="section-title mb-3">
        <label className="form-label">Volume</label>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="form-range volume-slider"
        />

        <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '4px' }}>
          {Math.round(volume * 100)}%
        </div>
      </div>

    <br />
      <div className="section-title mb-3">
        <label className="form-label">Speed</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          value={speed}
          onChange={handleSpeedChange}
          className="form-range"
        />

        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          {speed.toFixed(2)}x
        </div>
      </div>
    </div>
  );
}
