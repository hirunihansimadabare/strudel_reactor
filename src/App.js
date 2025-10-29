import './App.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { control, evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';

import PreProcessingEditor from './components/PreProcessingEditor';
import AudioControls from './components/AudioControls';
import PreProcessingControls from './components/PreProcessingControls';
import StrudelRepl from './components/strudelRepl';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

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
export default function StrudelDemo(){
    const hasRun = useRef(false);

    //Holds text input of the editor
    const [editorText, setEditorText] = useState(stranger_tune);

    //Hold status of all the controls
    const [controlsState, setControlsState] = useState({p1_Radio: 'ON', instrument: 'supersaw',});

    //Replace the old exported Proc and ProcAndPlay
    const Proc = useCallback(() => {
        if (!globalEditor) return;

        //Get the current replacement based on the control state
        const replacement = ProcessText(controlsState)

        //Apply the replacement to the song
        let proc_text_replaced = editorText.replaceAll('<p1_Radio>', replacement['<p1_Radio>']);

        //Apply new instrument tag replacement
        proc_text_replaced = proc_text_replaced.replaceAll('<instrument_tag>', replacement['<instrument_tag>']);

        //Send preprocessed code to Strudel Repl
        globalEditor.setCode(proc_text_replaced);

        console.log("Preprocessed. Replacement: ", replacement)
    }, [editorText, controlsState]);


    //--Audio handlers--
    const handlePlay = () => globalEditor?.evaluate();
    const handleProcAndPlay = () =>  {Proc(); handlePlay(); };
    const handleStop = () => globalEditor?.stop();

    //--State updates--
    const handleControlChange = (controlName, value) => {
        setControlsState(previousState => ({
            ...previousState, [controlName]: value
        }));
    };
    
    //--Initialization--

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
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
            }
            return () => {
                document.removeEventListener("d3Data", handleD3Data);
            };
    }, [Proc]);

// --The layout--
return (
    <div>
      <h2 className="visually-hidden">Strudel Demo</h2>
      <main>
        <div className="container-fluid">
          <div className="row g-4 align-items-stretch">
            {/* Preprocessing editor */}
            <div className="col-12 col-lg-7 d-flex">
              <div className="card-box flex-fill" style={{ display: 'flex', flexDirection: 'column' }}>
                <h5 className="section-title">Preprocessing editor</h5>
                <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                  <PreProcessingEditor text={editorText} onTextChange={setEditorText} />
                </div>
              </div>
            </div>
  
            <div className="col-12 col-lg-5 d-flex flex-column gap-4">
              {/* Audio controls */}
              <div className="card-box tight" style={{ flex: '1 0 auto' }}>
                <h5 className="section-title">Audio Controls</h5>
                <div className="audio-grid">
                  <AudioControls
                    onPlay={handlePlay}
                    onStop={handleStop}
                    onPreProcess={Proc}
                    onProcAndPlay={handleProcAndPlay}
                  />
                </div>
              </div>
  
              {/* Radio and instrument swap */}
              <div className="card-box" style={{ flex: '2 0 auto' }}>
                <h5 className="section-title">Radio and instrument swap</h5>
                <PreProcessingControls
                  controlsState={controlsState}
                  onControlChange={handleControlChange}
                  onControlUpdate={handleProcAndPlay}
                />
              </div>
            </div>
          </div>
  
          {/*Strudel demo */}
          <div className="row g-4 mt-1">
            <div className="col-12">
              <div className="card-box strudel-card">
                <h5 className="section-title">Strudel demo</h5>
                <div className="strudel-repl-scroll">
                  <StrudelRepl />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Pianoroll canvas */}
        <canvas id="roll"></canvas>
      </main>
    </div>
  );
} 