import './App.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { transpiler } from '@strudel/transpiler';
import { default_tune, alt1_tune, alt2_tune, alt3_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';

import PreProcessingEditor from './components/PreProcessingEditor';
import AudioControls from './components/AudioControls';
import PreProcessingControls from './components/PreProcessingControls';
import StrudelRepl from './components/strudelRepl';
import D3Graph from './components/D3Graph';

let globalEditor = null;
//Helper key for localStorage
const local_storage_key = 'strudelControlState';

function getSongCode(song) {
    switch (song) {
      case 'alt1':
        return alt1_tune;
      case 'alt2':
        return alt2_tune;
      case 'alt3':
        return alt3_tune;
      default:
        return default_tune;
    }
  }

const songAccentMap = {
    default: '#2dd4bf',
    alt1: '#f97316',
    alt2: '#a855f7', 
    alt3: '#22c55e', 
};

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
            return { p1_Radio: 'ON', instrument: 'supersaw', volume: 0.5, song: 'default', speed: 1.0};
        }
        console.log('Control state loaded');
        const saved=  JSON.parse(serializedState);
        return {
            p1_Radio: saved.p1_Radio ?? "ON", 
            instrument: saved.instrument ?? "supersaw",
            volume: saved.volume ?? 0.5,
            song: saved.song ?? 'default',
            speed: saved.speed ?? 1.0,
            ...saved
        }
    } catch (e) {
        console.error('Could not load state', e);
        return {p1_Radio: 'ON', instrument: 'supersaw', volume: 0.5, song: 'default', speed: 1.0};
    }
}

//Function to handle the export of the state as a JSON file
export function exportControlsState(controlsState){
    try {
        //Serialize javascript object to a formatted json string and 
        const jsonString = JSON.stringify(controlsState, null, 2)
        //Create a data url scheme containing json data
        const dataStr = "data:text/json;charset=utf-8, " + encodeURIComponent(jsonString);
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

    const vol = typeof controlsState.volume === "number" ? controlsState.volume: 0.5;
    finalReplacement['<master_gain>'] = vol.toFixed(2);

    const speed = typeof controlsState.speed === "number"? controlsState.speed: 1.0;
    finalReplacement['<speed_mul>'] = speed.toFixed(2);
    return finalReplacement;
}

//Main app component
export default function StrudelDemo() {
    const hasRun = useRef(false);
    const editorRootRef = useRef(null);
    //Holds text input of the editor
    const [editorText, setEditorText] = useState(default_tune);
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
        .replaceAll('<instrument_tag>', replacement['<instrument_tag>'])
        .replaceAll('<master_gain>', replacement['<master_gain>'])
        .replaceAll('<speed_mul>', replacement['<speed_mul>']);
        

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
    
    //--JSON export and import handlers--
    //Handler for export button
    const handleExportState = () =>{
        exportControlsState(controlsState);
    };

    //Handler for import file input
    const handleImportState = (event) => {
        //Get the first file selected by the user
        const file = event.target.files[0];
        if (!file) return; //Exit if no file is selected

        //Create an object to read the content of the file 
        const reader= new FileReader();
        reader.onload = (e) =>{
            try {
                //try to parse the file content into a javascript object
                const loadedState = JSON.parse(e.target.result);
                if (loadedState.p1_Radio !== undefined && loadedState.instrument !== undefined){
                    //Update the React state with the successfully loaded data
                    setControlsState(loadedState);
                    //Apply new settings
                    handleProcAndPlay();
                    console.log('Controls state imported successfully!');
                } else {
                    console.error("Import failed! JSON format is invalid");
                }
            } catch (e){
                console.error("Import failed! Could not parse JSON file", e);
            }
        };
        //Start reading the file content as plain text string
        reader.readAsText(file);
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

    useEffect(() => {
        // load the correct song template into the editor
        const songCode = getSongCode(controlsState.song);
        setEditorText(songCode);
      
        // Update the global accent colour based on song
        const accent = songAccentMap[controlsState.song] || songAccentMap.default;
        document.documentElement.style.setProperty('--accent', accent);
    }, [controlsState.song]);

// --The layout--
return (
    <div>
      <h2 className="visually-hidden">Strudel Demo</h2>
      <main>
        <div className="container-fluid">
          <div className="row align-items-stretch">
            {/* D3 Graph */}
            <div className="col-12 col-lg-6 d-flex">
                    <div className="card-box d3-card flex-fill">
                        <h5 className="section-title">Strudel log D3 Graph</h5>
                        <div className="d3-plot">
                        <D3Graph />
                        </div>
                    </div>
            </div>

            {/* Right side controls */}
            
            <div className="col-12 col-lg-5 d-flex audio-column">
              
            {/* Audio Controls */}
              <div className="card-box tight flex-fill">
                <h5 className="section-title">Audio Controls</h5>
                  <AudioControls
                    onPlay={handlePlay}
                    onStop={handleStop}
                    onPreProcess={Proc}
                    onProcAndPlay={handleProcAndPlay}
                    volume={controlsState.volume}
                    setVolume={(vol) =>
                        setControlsState((prev) => {
                            const updated = {...prev, volume: vol};
                            saveControlsState(updated);
                            return updated;
                        })
                    }
                    speed={controlsState.speed}
                    setSpeed={(s) =>
                        setControlsState((prev) => {
                            const updated = { ...prev, speed: s };
                            saveControlsState(updated);
                            return updated;
                        })
                    }
                  />
              </div>

            {/* Instrument Swap */}
              <div className="card-box flex-fill">
                <PreProcessingControls
                  controlsState={controlsState}
                  onControlChange={handleControlChange}
                  onControlUpdate={handleProcAndPlay}
                  onExportState={handleExportState}
                  onImportState={handleImportState}
                />
              </div>
            </div>
        </div>

        {/* Strudel demo*/}
        <div className="row align-items-stretch">
            <div className="col-12 col-lg-6 d-flex order-lg-1">
                <div className="card-box strudel-card flex-fill">
                    <h5 className="section-title">Strudel demo</h5>
                    <div className="strudel-repl-scroll">
                        <StrudelRepl />
                    </div>
                <div ref={editorRootRef} className="editor-root" />
            </div>
        </div>

        {/* Preprocessing editor */}
        <div className="col-12 col-lg-6 d-flex order-lg-2">
            <div className="card-box flex-fill" style={{ display: "flex", flexDirection: "column", height: "55vh", minHeight: "260px",}}>
                <h5 className="section-title">Preprocessing editor</h5>
                <div style={{ flexGrow: 1, overflow: "auto", minHeight: 0 }}>
                    <PreProcessingEditor text={editorText} onTextChange={setEditorText} />
                </div>
            </div>
        </div>
    </div>

        {/* Pianoroll canvas */}
        <canvas id="roll"></canvas>
        </div>
      </main>
    </div>
  );
}
