import { control } from '@strudel/core';
import React from 'react'

//controlsState is the current state object
//onControlChange is the function used to update the control state in App.js
//onControlUpdate is the function to call ProcAndPlay
export default function PreProcessingControls({controlsState, onControlChange, onControlUpdate}){
    const handleRadioChange = (value) => {
        onControlChange('p1_Radio', value);

        //Triggers Preprocess and Play 
        onControlUpdate();
    };

    return (
        <>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault" checked={controlsState.p1_Radio === 'ON'} onChange={() => handleRadioChange('ON')} />
                <label className="form-check-label" htmlFor="flexRadioDefault1">p1: ON</label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={controlsState.p1_Radio === 'HUSH'} onChange={() => handleRadioChange('HUSH')} />
                <label className="form-check-label" htmlFor="flexRadioDefault2">p1: HUSH</label>
            </div>
        </>
    );

}