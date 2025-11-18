import { control } from '@strudel/core';
import React, {useRef} from 'react'

//controlsState is the current state object
//onControlChange is the function used to update the control state in App.js
//onControlUpdate is the function to call ProcAndPlay
export default function PreProcessingControls({controlsState, onControlChange, onControlUpdate, onExportState, onImportState}){
    //Handles p1_radio button change
    const handleRadioChange = (value) => {
        onControlChange('p1_Radio', value);
        //Triggers Preprocess and Play 
        onControlUpdate();
    };

    //handle song selection change
    const handleSongChange = (value) => {
        onControlChange('song', value);
        // onControlUpdate();
    };

    //Ref to trigger the file input click when import button is pressed
    const fileInputRef = useRef(null);

    //Manually triggers the hidden file input
    const handleImportClick = ()=>{
        fileInputRef.current.click();
    };
    
    const songOptions = [
        {label: 'Default Groove', value: 'default'},
        {label: 'Alt 1 - Punchy', value: 'alt1'},
        {label: 'Alt 2 - Deep Bass', value: 'alt2'},
        {label: 'Alt 3 - Bright Bass', value: 'alt3'}
    ];

    return (
        <div className="d-flex flex-column gap-3">
            
        {/* Radio Controls */}
        <div className="card-box">
        <h5 className="section-title mb-3">Mute/Unmute</h5>
        <fieldset className="d-flex align-items-center gap-4 m-0">
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="p1Radio" id="radioOn" checked={controlsState.p1_Radio === "ON"} onChange={() => handleRadioChange("ON")}/>
                <label className="form-check-label" htmlFor="radioOn">ON</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="p1Radio" id="radioHUSH" checked={controlsState.p1_Radio === "HUSH"} onChange={() => handleRadioChange("HUSH")}/>
            <label className="form-check-label" htmlFor="radioHUSH">HUSH</label>
            </div>
        </fieldset>
        </div>

        {/* Song selector */}
        <div className="card-box">
        <h5 className="section-title mb-3">Song Selector</h5>
        <div className="d-flex flex-column gap-2">
          {songOptions.map((opt) => (
            <div className="form-check" key={opt.value}>
              <input
                className="form-check-input"
                type="radio"
                id={`song-${opt.value}`}
                name="songSelect"
                checked={controlsState.song === opt.value}
                onChange={() => handleSongChange(opt.value)}
              />
              <label className="form-check-label" htmlFor={`song-${opt.value}`}>
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      </div>

        {/* JSON Export/Import Section*/}
        <div className="card-box">
            <h5 className="section-title text-start mb-3">Preset File Management</h5>
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-outline-light flex-fill" onClick={onExportState}>Export Preset</button>
                <button className="btn btn-outline-light flex-fill" onClick={handleImportClick}>Import Preset</button>
                <input type="file" ref={fileInputRef} onChange={onImportState} style={{ display: "none" }} accept=".json"/>
            </div>
        </div>
    </div>
    );
} 