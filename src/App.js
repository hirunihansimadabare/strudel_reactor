import './App.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { transpiler } from '@strudel/transpiler';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';

import PreProcessingEditor from './components/PreProcessingEditor';
import AudioControls from './components/AudioControls';
import PreProcessingControls from './components/PreProcessingControls';
import StrudelRepl from './components/strudelRepl';
import D3Graph from './components/D3Graph';

let globalEditor = null;
//Helper key for localStorage
const local_storage_key = 'strudelControlState';

{/* JSON Handling */ }
//function to save the current state
export function saveControlsState(controlsState){
    try{
        const serializedState = JSON.stringify(controlsState);
        localStorage.setItem(local_storage_key, serializedState);
        console.log('Controls state saved to localStorage');
    } catch (e){
        console.error('Could not save the state to localStorage:', e);
    }
}

//Function to load the control state 
export function loadControlsState(controlsState){
    try {
        const serializedState = localStorage.getItem(local_storage_key);
        if (serializedState === null) {
            // Return initial default state if nothing is found
            return { p1_Radio: 'ON', instrument: 'supersaw'};
        }
        console.log('Control state loaded');
        return JSON.parse(serializedState);
    } catch (e) {
        console.error('Could not load state', e);
        return {p1_Radio: 'ON', instrument: 'supersaw'};
    }
}

//Function to handle the export of the state as a JSON file
export function exportControlsState(controlsState){
    try {
        //Create a data url scheme containing json data
        const dataStr = "data:text/json;charset=utf-8, " + encodeURIComponent;
        //Serialize javascript object to a formatted json string and 
        const jsonString = JSON.stringify(controlsState, null, 2)
        //Create an anchor element in the document
        const downloadAnchorNode = document.createElement('a');
        //Set the href attribute to the url
        downloadAnchorNode.setAttribute("href", dataStr);
        //set the download attribute 
        downloadAnchorNode.setAttribute("download", "strudel_controls_preset.json");
        //Append anchor node to the body 
        document.body.appendChild(downloadAnchorNode);
        //Trigger a click on the link, which initiates the download 
        downloadAnchorNode.click();
        //Remove the temporary anchor node
        downloadAnchorNode.remove();
        console.log('Controls state exported');
        } catch (e) {
            console.error('Could not export state', e);
        }
}

//Preprocessing logic
export function ProcessText(controlsState) {
  let finalReplacement = {};
  //P1 radio logic
  finalReplacement['<p1_Radio>'] = controlsState.p1_Radio === 'HUSH' ? "_" : "";

  //Instrument logic
  finalReplacement['<instrument_tag>'] = `"${controlsState.instrument}"`;
  return finalReplacement;
}

//Main app component
export default function StrudelDemo() {
    const hasRun = useRef(false);
    const editorRootRef = useRef(null);
    //Holds text input of the editor
    const [editorText, setEditorText] = useState(stranger_tune);
    //Holds status of all the controls    
    const [controlsState, setControlsState] = useState(loadControlsState());

    //Replaces the old exported Proc and ProcAndPlay
    const Proc = useCallback(() => {
        if (!globalEditor) return;
        //Save state immediately before processing
        saveControlsState(controlsState);
        //Get the current replacement based on the control status
        const replacement = ProcessText(controlsState);
        let processedText = editorText
        //Apply the replacement to the song
        .replaceAll('<p1_Radio>', replacement['<p1_Radio>'])
        //Apply new instrument tag replacement
        .replaceAll('<instrument_tag>', replacement['<instrument_tag>']);

        //Send processed code to Strudel Repl
        globalEditor.setCode(processedText);
    }, [editorText, controlsState]);

    //--Audio handlers--
    const handlePlay = async () => {
        try { await getAudioContext().resume(); 
        } catch (e) {}
        if (!globalEditor) return;
        Proc();
        globalEditor.evaluate();
    };
    const handleStop = () => globalEditor?.stop();
    const handleProcAndPlay = async () => { Proc(); await handlePlay(); };

    //--State updates--
    const handleControlChange = (controlName, value) => {
        setControlsState((previousState) => ({ ...previousState, [controlName]: value }));
    };
    
    //--Initialization--
    useEffect(() => {
        if (hasRun.current || !editorRootRef.current) return;
        console_monkey_patch();
        hasRun.current = true;

        const canvas = document.getElementById('roll');
        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
        const drawContext = canvas.getContext('2d');
        const drawTime = [-2, 2];

        globalEditor = new StrudelMirror({
        defaultOutput: webaudioOutput,
        getTime: () => getAudioContext().currentTime,
        transpiler,
        root: editorRootRef.current,
        drawTime,
        onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
        prebake: async () => {
            initAudioOnFirstClick();
            const loadModules = evalScope(
            import('@strudel/core'),
            import('@strudel/draw'),
            import('@strudel/mini'),
            import('@strudel/tonal'),
            import('@strudel/webaudio'),
            );
            await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
        },
        });
        Proc();

    }, [Proc]);

// --The layout--
return (
    <div>
      <h2 className="visually-hidden">Strudel Demo</h2>
      <main>
        <div className="container-fluid">
          <div className="row g-4 align-items-stretch">
            {/* D3 Graph */}
            <div className="col-lg-5 d-flex">
                <div className="col-12">
                    <div className="card-box flex-fill" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h5 className="section-title">Strudel log D3 Graph</h5>
                        <D3Graph />
                    </div>
                </div>
            </div>

            {/* Right side controls */}
            <div className="col-12 col-lg-3 d-flex">
              {/* Audio Controls */}
              <div className="card-box tight flex-fill audio-card">
                <h5 className="section-title">Audio Controls</h5>
                <div className="audio-grid-4x4">
                  <AudioControls
                    onPlay={handlePlay}
                    onStop={handleStop}
                    onPreProcess={Proc}
                    onProcAndPlay={handleProcAndPlay}
                  />
                </div>
              </div>

              {/* Instrument Swap */}
              <div className="col-12 col-lg-4 d-flex card-box flex-fill">
                <h5 className="section-title">Radio and instrument swap</h5>
                <PreProcessingControls
                  controlsState={controlsState}
                  onControlChange={handleControlChange}
                  onControlUpdate={handleProcAndPlay}
                />
              </div>
            </div>
          </div>

          {/* Strudel Demo */}
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-6 d-flex">
              <div className="card-box strudel-card flex-fill">
                <h5 className="section-title">Strudel demo</h5>
                <div className="strudel-repl-scroll">
                  <StrudelRepl />
                </div>
                <div ref={editorRootRef} className="editor-root" />
              </div>
            </div>
          </div>

        {/* Pianoroll canvas */}
        <canvas id="roll"></canvas>
        
        {/* Preprocessing editor */}
        <div className="col-12 col-lg-6 d-flex">
            <div className="card-box flex-fill" style={{ display: 'flex', flexDirection: 'column' }}>
                <h5 className="section-title">Preprocessing editor</h5>
                <div style={{ flexGrow: 1,height: '38vh', overflowY: 'auto' }}>
                    <PreProcessingEditor text={editorText} onTextChange={setEditorText} />
                </div>
            </div>
        </div>
        </div>
      </main>
    </div>
  );
}
