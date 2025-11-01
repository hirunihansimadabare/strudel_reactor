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
    const [controlsState, setControlsState] = useState({ p1_Radio: 'ON', instrument: 'supersaw' });

    //Replaces the old exported Proc and ProcAndPlay
    const Proc = useCallback(() => {
        if (!globalEditor) return;
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
            
            {/* Preprocessing editor */}
            <div className="col-12 col-lg-7 d-flex">
              <div className="card-box flex-fill" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h5 className="section-title">Preprocessing editor</h5>
                <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                  <PreProcessingEditor text={editorText} onTextChange={setEditorText} />
                </div>
              </div>
            </div>

            {/* Right side controls */}
            <div className="col-12 col-lg-5 d-flex flex-column gap-4">
              {/* Audio Controls */}
              <div className="card-box tight" style={{ flex: '1 0 auto' }}>
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

          {/* Strudel Demo */}
          <div className="row g-4 mt-1">
            <div className="col-12">
              <div className="card-box strudel-card">
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

        {/* D3 Graph */}
        <div className="row g-4 mt-1">
            <div className="col-12">
                <div className="card-box">
                    <h5 className="section-title">Strudel log D3 Graph</h5>
                    <D3Graph />
                </div>
            </div>
        </div>
        </div>
      </main>
    </div>
  );
}
