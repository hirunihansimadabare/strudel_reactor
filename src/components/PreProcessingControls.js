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
        <div className="preprocessing-controls-container">
            
            {/* Radio Controls */}
            <h5 className="section-title text-start">Mute/Unmute</h5>
            <div className="d-flex justify-content-around">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="p1Radio" id="radioOn" 
                        checked={controlsState.p1_Radio === 'ON'} 
                        onChange={() => handleRadioChange('ON')} />
                    <label className="form-check-label" htmlFor="radioOn">ON</label>
                </div>

                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="p1Radio" id="radioHUSH" 
                        checked={controlsState.p1_Radio === 'HUSH'} 
                        onChange={() => handleRadioChange('HUSH')} />
                    <label className="form-check-label" htmlFor="radioHUSH">HUSH</label>
                </div>
            </div>

            <hr />
            <h5 className="section-title" text-start>Instrument swap</h5>
            <div className="d-flex flex-wrap justify-content-between mb-3">
                {instrumentOptions.map((option) => (
                    <div className="form-check form-check-inline" key={option.value}>
                        <input className="form-check-input" type="radio" name="instrumentSelect" id={`inst_${option.value}`} checked={controlsState.instrument === option.value}
                            onChange={() => handleInstrumentChange(option.value)}
                        />
                        <label className="form-check-label" htmlFor={`inst_${option.value}`}>
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            <hr />
            {/* JSON Export/Import Section*/}
            <h5 className="section-title text-start">Preset File Management</h5>
            <div className="d-flex justify-content-between gap-2 mb-3">
                
                {/* Export Button */}
                <button className="btn btn-secondary btn-sm w-50" onClick={onExportState}>Export Preset</button>
                {/* Import Button */}
                <button className="btn btn-secondary btn-sm w-50" onClick={handleImportClick}>Import Preset</button>
            </div>
            <input type="file" ref={fileInputRef} onChange={onImportState} style={{ display: 'none' }} accept=".json"/>

            {/* Update Button*/}
            <button className="btn btn-primary w-100 mt-2" onClick={onControlUpdate} >Apply Changes & Play</button>    
        </div>
    );
} 