"use strict";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

function CreateAudioContext()
{
    let audioCtx = new AudioContext();
    console.log("Created AudioContext, sampleRate = " + audioCtx.sampleRate);
    audioCtx.dest = audioCtx.createGain();
    audioCtx.dest.connect(audioCtx.destination);
    //if(audioCtx.audioWorklet) audioCtx.audioWorklet.addModule('audio-processors.js');
    return audioCtx;
}

let gAudioCtx;
function GetAudioContext()
{
    if(!gAudioCtx) gAudioCtx = CreateAudioContext();
    return gAudioCtx;
}

let gMicrophoneSource;
async function GetMicrophoneSource() {
    if(gMicrophoneSource) return gMicrophoneSource;
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    return gMicrophoneSource = GetAudioContext().createMediaStreamSource(stream);
}
