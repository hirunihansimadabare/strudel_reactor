import React from 'react';
import { getAudioContext } from '@strudel/webaudio';

export default function AudioControls({
  onPlay,
  onStop,
  onPreProcess,
  onProcAndPlay,
  volume,
  setVolume
}) {
  
  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol); // update React state
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
    </div>
  );
}
