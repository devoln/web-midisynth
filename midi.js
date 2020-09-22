"use strict";

class MidiState
{
    constructor()
    {
        this.Channels = [{CurrentInstrument: gInstruments.AcousticGuitarNylon}];
        InitInstrument(this.Channels[0].CurrentInstrument);
    }
    init(audioCtx)
    {
        if(this.audioCtx) return;
        this.audioCtx = audioCtx;
        this.reset();
    }
    reset()
    {
        this.Channels = [];
        this.compressor = this.audioCtx.createDynamicsCompressor();
        this.compressor.connect(this.audioCtx.dest);
        for(let i = 0; i < 16; i++)
        {
            const ch = {};
            ch.PitchBendRange = 2;
            ch.CurrentInstrument = gInstruments.AcousticGuitarNylon;
            ch.PlayingNotes = {};
            ch.VolumeGain = this.audioCtx.createGain();
            ch.VolumeGain.gain.value = 1;
            ch.PitchBend = this.audioCtx.createConstantSource();
            ch.PitchBend.start();
            ch.Controls = [0,0,0,0];
            ch.StereoPanner = this.audioCtx.createStereoPanner();
            ch.VolumeGain.connect(ch.StereoPanner);
            ch.StereoPanner.connect(this.compressor);
            this.Channels.push(ch);
        }
    }

    noteOn(channel, note, velocity)
    {
        if(channel === 9) return; //drums, not implemented yet
        const ch = this.Channels[channel];
        if(!ch.CurrentInstrument) return;
        const freq = 16.352*Math.pow(2, note/12);
        if(!ch.CurrentInstrument.PlayNote) InitInstrument(ch.CurrentInstrument);
        if(ch.PlayingNotes[note])
        {
            console.error("noteOn when previous note is playing!");
            this.noteOff(channel, note);
        }
        ch.PlayingNotes[note] = ch.CurrentInstrument.PlayNote(freq, velocity / 127, 0, this.audioCtx, ch.VolumeGain);
        ch.PitchBend.connect(ch.PlayingNotes[note].detune);
    }
    noteOff(channel, note)
    {
        const ch = this.Channels[channel];
        const osc = ch.PlayingNotes[note];
        if(!osc) return;
        osc.NoteOff();
        ch.PlayingNotes[note] = null;
    }
    controlModeChange(channel, mode, value)
    {
        const ch = this.Channels[channel];
        if(mode === 1)
        {
            //modulation
        }
        if(mode === 7)
        {
            ch.VolumeGain.gain.setValueAtTime(ch.VolumeGain.gain.value, this.audioCtx.currentTime);
            ch.VolumeGain.gain.linearRampToValueAtTime(value / 127.0, this.audioCtx.currentTime+0.01);
        }
        if(mode === 10)
        {
            ch.StereoPanner.pan.setValueAtTime(ch.StereoPanner.pan.value, this.audioCtx.currentTime);
            ch.StereoPanner.pan.linearRampToValueAtTime(value / 63.5 - 1, this.audioCtx.currentTime+0.01);
        }
        if(mode === 91)
        {
            //device.OnChannelReverbChange({Time, channel, data1});
        }
        if(mode >= 123 && mode <= 127) //all notes off
        {
            for(const note in ch.PlayingNotes)
            {
                if(!ch.PlayingNotes.hasOwnProperty(note)) continue;
                const osc = ch.PlayingNotes[note];
                if(!osc) continue;
                osc.NoteOff();
                ch.PlayingNotes[note] = null;
            }
        }
        if(mode >= 71 && mode <= 74)
            ch.Controls[mode - 71] = value;
    }
    programChange(channel, instrCode)
    {
        const ch = this.Channels[channel];
        let instr = gInstrumentMapping[instrCode];
        if(instr) InitInstrument(instr);
        ch.CurrentInstrument = instr;
    }
    pitchBendRange(channel, value) {
        const ch = this.Channels[channel];
        ch.PitchBend.offset.value = (value-8192)/8192*ch.PitchBendRange*100;
    }
}

const MidiEventTypes = {
    NoteOff: 8,
    NoteOn: 9,
    PolyphonicAftertouch: 10,
    ControlModeChange: 11,
    ProgramChange: 12,
    ChannelAftertouch: 13,
    PitchWheelRange: 14,
    System: 15
};

const gMidiState = new MidiState();

function OnMIDIMessage(message)
{
    //console.log(message.data);
    const type = message.data[0] >> 4;
    const channel = message.data[0] & 15;
    const audioCtx = GetAudioContext();
    gMidiState.init(audioCtx);
    if(type === MidiEventTypes.NoteOn && message.data[2])
    {
        gMidiState.noteOn(channel, message.data[1], message.data[2]);
        return;
    }
    if(type === MidiEventTypes.NoteOff || type === MidiEventTypes.NoteOn && message.data[2] === 0)
    {
        const note = message.data[1];
        gMidiState.noteOff(channel, note);
        return;
    }
    if(type === MidiEventTypes.ControlModeChange)
    {
        gMidiState.controlModeChange(channel, message.data[1], message.data[2]);
        return;
    }
    if(type === MidiEventTypes.ProgramChange)
    {
        gMidiState.programChange(channel, message.data[1]);
    }
    if(type === MidiEventTypes.PitchWheelRange)
    {
        gMidiState.pitchBendRange(channel, (message.data[2] << 7) | message.data[1]);
    }
}

function OnMidiSuccess(midi) {
    let inputs = midi.inputs.values();

    for (let input = inputs.next();
         input && !input.done;
         input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = OnMIDIMessage;
    }
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(OnMidiSuccess, () => console.error('No access to your midi devices.'));
}

function PlayMidiFile(buffer)
{
    let file = new MIDIFile(buffer);
    let events = file.getEvents();
    for(let i = 0, len = events.length; i < len; i++)
    {
        let evt = events[i];
        if(evt.subtype === MidiEventTypes.NoteOn || evt.subtype === MidiEventTypes.NoteOff)
            evt.param1 -= 12;
        evt.timeout = setTimeout(() =>
            OnMIDIMessage({data: [(evt.subtype << 4) | evt.channel, evt.param1, evt.param2]}),
            events[i].playTime);
    }
    let res = {events};
    res.Stop = () => {
        for(let i = 0, len = events.length; i < len; i++)
            clearTimeout(events[i].timeout);
        for(let channel = 0; channel < 16; channel++)
            OnMIDIMessage({data: [(MidiEventTypes.ControlModeChange << 4)|channel, 123]});
    };
    return res;
}
