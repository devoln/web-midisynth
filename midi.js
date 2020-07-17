"use strict";

// Отсчёт номеров инструментов с 0.
const gInstrumentMapping = {
    0: gInstruments.AcousticPiano,
    1: gInstruments.BrightAcousticPiano, //
    2: gInstruments.AcousticPiano, //
    3: gInstruments.AcousticPiano, //
    4: gInstruments.AcousticPiano, //Electric Piano
    5: gInstruments.AcousticPiano, //Electric Piano 2
    6: gInstruments.AcousticPiano, //
    7: gInstruments.Clav,

    8: gInstruments.Celesta,
    9: gInstruments.Glockenspiel,
    10: gInstruments.MusicBox,
    11: gInstruments.Vibraphone,
    12: gInstruments.Marimba,
    13: gInstruments.Xylophone,
    14: gInstruments.Marimba, //Tubular Bells
    15: gInstruments.Kalimba, //Dulcimer

    16: gInstruments.SynthOrgan,
    17: gInstruments.PercussiveOrgan,
    18: gInstruments.RockOrgan,
    19: gInstruments.SynthOrgan,
    20: gInstruments.SynthOrgan,
    21: gInstruments.Accordion, //Accordion
    22: gInstruments.Harmonica,
    23: gInstruments.SynthOrgan,

    24: gInstruments.AcousticGuitarNylon, //Accoustic Guitar (nylon)
    25: gInstruments.AcousticGuitarSteel, //Accoustic Guitar (Steel)
    26: gInstruments.ElectricGuitarJazz, //Electric Guitar (jazz)
    27: gInstruments.ElectricGuitarClean, //Electric Guitar (clean)
    28: gInstruments.ElectricGuitarMuted, //Electric Guitar (muted)
    29: gInstruments.AcousticGuitarNylon,
    30: gInstruments.AcousticGuitarNylon,
    31: gInstruments.AcousticGuitarNylon,

    32: gInstruments.AcousticBass, //Acoustic Bass
    33: gInstruments.ElectricBassPick, //ElectricBassFinger
    34: gInstruments.ElectricBassPick,
    35: gInstruments.FretlessBass,
    36: gInstruments.SlapBass,
    37: gInstruments.SlapBass,
    38: gInstruments.SynthBass1,
    39: gInstruments.SynthBass2,

    40: gInstruments.Violin, //Violin
    41: gInstruments.Violin, //Viola
    42: gInstruments.Violin, //Cello
    44: gInstruments.TremoloStrings,
    45: gInstruments.PizzicatoStrings,
    46: gInstruments.AcousticGuitarNylon, //Orchestral Strings
    47: gInstruments.Timpani,
    48: gInstruments.StringEnsemble, //String Ensemble 1
    49: gInstruments.StringEnsemble2, //String Ensemble 2
    50: gInstruments.SynthStrings, //Synth Strings 1
    51: gInstruments.Pad8Sweep, //Synth Strings 2
    52: gInstruments.ChoirAahs,
    53: gInstruments.VoiceOohs,
    54: gInstruments.SynthVoice,

    55: gInstruments.OrchestraHit,
    56: gInstruments.Trumpet,
    57: gInstruments.TrumpetOld,
    58: gInstruments.Tuba,
    59: gInstruments.TrumpetOld,
    60: gInstruments.FrenchHorn,
    61: gInstruments.BrassSection,
    62: gInstruments.SynthBrass,
    63: gInstruments.SynthBrass,
    64: gInstruments.Sax,
    65: gInstruments.Sax,
    66: gInstruments.Sax,
    67: gInstruments.Sax,
    68: gInstruments.Oboe,
    69: gInstruments.EnglishHorn,
    70: gInstruments.TrumpetOld,
    71: gInstruments.Clarinet,
    72: gInstruments.Flute, //Piccolo
    73: gInstruments.Flute,
    74: gInstruments.Recorder,
    75: gInstruments.Flute,
    76: gInstruments.Whistle,
    77: gInstruments.Whistle,
    78: gInstruments.Whistle,
    79: gInstruments.Ocarina,
    80: gInstruments.Lead1Square,
    81: gInstruments.Lead2Sawtooth,
    82: gInstruments.Calliope,
    83: gInstruments.SynthVoice,
    84: gInstruments.Lead5Charang,
    85: gInstruments.SynthVoice,
    86: gInstruments.SynthStrings, //TODO: Lead 7 (fifths)
    87: gInstruments.BassLead,
    88: gInstruments.NewAge,
    89: gInstruments.Pad8Sweep,
    90: gInstruments.Pad3Polysynth,
    91: gInstruments.Pad4Choir,
    92: gInstruments.Pad5Bowed,
    93: gInstruments.Pad8Sweep,
    94: gInstruments.Pad7Halo,
    95: gInstruments.Pad8Sweep,
    96: gInstruments.Fx1Rain,
    97: gInstruments.Fx2SoundTrack,
    98: gInstruments.Vibraphone, //FX3 (crystal)
    99: gInstruments.Fx4Atmosphere,
    100: gInstruments.SynthVoice,
    101: gInstruments.Fx6Goblins,
    102: gInstruments.Pad8Sweep,
    103: gInstruments.SynthVoice, //FX8 (sci-fi)
    104: gInstruments.Sitar,
    105: gInstruments.AcousticPiano, //
    106: gInstruments.Timpani, //TODO: Shamisen
    107: gInstruments.AcousticPiano, //
    108: gInstruments.Kalimba,
    109: gInstruments.Oboe, //TODO: Bagpipe
    110: gInstruments.Fiddle,
    111: gInstruments.Fiddle, //TODO: Shanai
    112: gInstruments.Kalimba,
    113: gInstruments.Marimba, //TODO: Tinkle Bell
    114: gInstruments.SteelDrums,
    119: gInstruments.ReverseCymbal,
    122: gInstruments.Seashore,
    124: gInstruments.PhoneRing,
    125: gInstruments.Helicopter,
    126: gInstruments.Applause,
    127: gInstruments.Gunshot,
};

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
    console.log('Got midi!', midi);
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
