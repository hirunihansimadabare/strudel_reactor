import React, { useState, useEffect } from 'react';

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
  
  const [speedInput, setSpeedInput] = useState(speed.toFixed(2));
  const [speedError, setSpeedError] = useState('');

  useEffect(() => {
    setSpeedInput(speed.toFixed(2));
    setSpeedError('');
  }, [speed]);

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    if (Number.isNaN(vol)) return;
    setVolume(vol);
  };

  const handleSpeedSliderChange = (e) => {
    const s = Number(e.target.value);
    if (Number.isNaN(s)) return;
    setSpeed(s);
    setSpeedError('');
  };
  
  const handleSpeedInputChange = (e) => {
    setSpeedInput(e.target.value);
  };
  
  const commitSpeedFromInput = () => {
    if (speedInput === '') {
      setSpeedError('Speed cannot be empty.');
      return;
    }

    const num = Number(speedInput);
    if (Number.isNaN(num)) {
      setSpeedError('Please enter a valid number between 0.00x and 2.00x.');
      return;
    }

    if (num < 0 || num > 2) {
      setSpeedError('Speed must be between 0.00x and 2.00x.');
      return;
    }
    setSpeed(num);
    setSpeedError('');
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
      {/* Volume */}
      <div className="ac-section">
        <div className="ac-header-row">
          <h6 className="ac-label">Volume</h6>
          <span className="ac-chip">{Math.round(volume * 100)}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="form-range volume-slider"
        />
      </div>

      {/* Speed*/}
      <div className="ac-section">
        <div className="ac-header-row">
          <h6 className="ac-label">Speed</h6>
          <span className="ac-chip">{speed.toFixed(2)}x</span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={speed}
          onChange={handleSpeedSliderChange}
          className="form-range speed-slider"
        />

        {/* Exact textbox */}
        <div className="ac-speed-row">
          <span className="muted mono">Exact:</span>
          <input
            type="number"
            min="0"
            max="2"
            step="0.01"
            value={speedInput}
            onChange={handleSpeedInputChange}
            onBlur={commitSpeedFromInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitSpeedFromInput();
              }
            }}
            className="form-control form-control-sm ac-speed-input mono"
          />
          <span className="muted mono">x</span>
        </div>

        {/* Error message */}
        {speedError && (
          <div className="ac-error">
            {speedError}
          </div>
        )}
      </div>
    </div>
  );
}
