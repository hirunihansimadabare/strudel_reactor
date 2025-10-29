import { control } from '@strudel/core';
import React from 'react'

//controlsState is the current state object
//onControlChange is the function used to update the control state in App.js
//onControlUpdate is the function to call ProcAndPlay
export default function PreProcessingControls({controlsState, onControlChange, onControlUpdate}){
    //Handles p1_radio button change
    const handleRadioChange = (value) => {
        onControlChange('p1_Radio', value);
        //Triggers Preprocess and Play 
        onControlUpdate();
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
        <>
            <hr />
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault" checked={controlsState.p1_Radio === 'ON'} onChange={() => handleRadioChange('ON')} />
                <label className="form-check-label" htmlFor="flexRadioDefault1">p1: ON</label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={controlsState.p1_Radio === 'HUSH'} onChange={() => handleRadioChange('HUSH')} />
                <label className="form-check-label" htmlFor="flexRadioDefault2">p1: HUSH</label>
            </div>

            <hr />
            <h5>Instrument swap</h5>
            <div>
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
        </>
    );
}   