"use strict";

let SGAudioFilePlayer = {
    components: {},
    data() {
        return {
            sampleBuffer: null,
            midiFile: null,
            fileArrayBuffer: null,
        }
    },
    props: {
        destAudioNode: AudioNode,
    },
    computed: {

    },
    watch: {

    },
    methods: {
        OnSelectSample() {
            let reader = new FileReader();
            reader.onload = e => {
                this.fileArrayBuffer = reader.result.slice(0);
                GetAudioContext().decodeAudioData(reader.result)
                    .then(audioBuffer => {
                        this.sampleBuffer = audioBuffer;
                    }).catch(e => {
                        try {
                            let midiFile = new MIDIFile(this.fileArrayBuffer);
                            this.midiFile = this.fileArrayBuffer;
                            this.sampleBuffer = null;
                        } catch(e) {
                            this.sampleBuffer = null;
                            this.midiFile = null;
                        }
                });
            };

            const picker = this.$refs.filePicker;
            if(picker && picker.files.length) reader.readAsArrayBuffer(picker.files[0]);
        },
        Play() {
            if(!this.destAudioNode) return;
            if(this.sampleBuffer)
            {
                const source = GetAudioContext().createBufferSource();
                source.buffer = this.sampleBuffer;
                source.connect(this.destAudioNode);
                source.start();
                this.playingSource = source;
                return;
            }
            if(this.midiFile)
            {
                this.playingMidi = PlayMidiFile(this.midiFile);
            }
        },
        Stop()
        {
            if(this.playingSource)
            {
                this.playingSource.stop();
                this.playingSource = null;
            }
            if(this.playingMidi)
            {
                this.playingMidi.Stop();
                this.playingMidi = null;
            }
        }
    },
    mounted() {
    },
    template: `
<div>
    <input ref="filePicker" type="file" accept="audio/*" @change="OnSelectSample()"/>
    <button @click="Play()">▶</button>
    <button @click="Stop()">■</button>
</div>`
};

Vue.component('sg-audio-file-player', SGAudioFilePlayer);
