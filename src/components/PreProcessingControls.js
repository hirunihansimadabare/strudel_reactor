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

    //Ref to trigger the file input click when import button is pressed
    const fileInputRef = useRef(null);

    //Manually triggers the hidden file input
    const handleImportClick = ()=>{
        fileInputRef.current.click();
    };
    //Handles new instrument change
    const handleInstrumentChange = (value) => {
        onControlChange('instrument', value);       
        onControlUpdate();
    };

    //Mapping for the four options of instrument
    const instrumentOptions = [
        {label: 'Default', value: 'supersaw'},
        {label: 'Piano', value: 'piano'},
        {label: 'Strings', value: 'strings'},
        {label: 'Bass', value: 'sine'},
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

        {/* Instrument swap */}
        <div className="card-box">
        <h5 className="section-title mb-3">Instrument swap</h5>
        <div className="d-flex flex-wrap gap-3">{instrumentOptions.map((opt) => (
            <div className="form-check" key={opt.value}>
                <input className="form-check-input" type="radio" name="instrumentSelect" id={`inst_${opt.value}`} checked={controlsState.instrument === opt.value} onChange={() => handleInstrumentChange(opt.value)}/>
                <label className="form-check-label" htmlFor={`inst_${opt.value}`}>{opt.label}</label>
            </div>
        ))}
        </div>
        </div>

        {/* JSON Export/Import Section*/}
        <div className="card-box">
            <h5 className="section-title text-start mb-3">Preset File Management</h5>
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-info flex-fill" onClick={onExportState}>Export Preset</button>
                <button className="btn btn-info flex-fill" onClick={handleImportClick}>Import Preset</button>
                <input type="file" ref={fileInputRef} onChange={onImportState} style={{ display: "none" }} accept=".json"/>
            </div>

            <button className="btn btn-primary w-100" onClick={onControlUpdate}>Apply Changes & Play</button>
        </div>
    </div>
    );
} 