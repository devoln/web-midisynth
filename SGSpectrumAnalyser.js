"use strict";

let SGSpectrumVisualizer2D = {
    components: {},
    data() {
        return {
            pause: false,
            yOffset: 0,
            interval: null,
            probeData: null,
        }
    },
    props: {
        analyserNode: AnalyserNode,
    },
    computed: {
        canvas() {
            return this.$refs.canvas2d;
        },
        spectrum() {
            const spec = new Uint8Array(this.analyserNode.frequencyBinCount);
            this.canvas.width = spec.length;
            this.canvas.height = 500;
            return spec;
        },
        canvasCtx() {
            return this.canvas.getContext('2d');
        },
        width() {
            return this.canvas.width;
        },
    },
    watch: {
        pause(newVal, oldVal) {
            if(newVal === oldVal) return;
            if(newVal) this.disable();
            else this.enable();
        }
    },
    methods: {
        updateSpectrogram() {
            if(!this.analyserNode) return;
            this.yOffset %= this.canvas.height;
            this.analyserNode.getByteFrequencyData(this.spectrum);
            const slice = this.canvasCtx.getImageData(0, this.yOffset, this.width, 2);
            for (let i = 0; i < this.spectrum.length; i++) {
                const val = this.spectrum[i];

                slice.data[4 * i] = val; // R
                slice.data[4 * i + 1] = val; // G
                slice.data[4 * i + 2] = val; // B
                slice.data[4 * i + 3] = 255;         // A

                slice.data[4 * (i + this.width)] = 255; // R
                slice.data[4 * (i + this.width) + 1] = 0; // G
                slice.data[4 * (i + this.width) + 2] = 0; // B
                slice.data[4 * (i + this.width) + 3] = 255;  // A
            }
            this.canvasCtx.putImageData(slice, 0, this.yOffset);
            this.yOffset++;
        },
        enable() {
            this.interval = setInterval(() => this.updateSpectrogram(), 1000.0/24);
        },
        disable() {
            if(this.interval !== null) clearInterval(this.interval);
        },
        setProbe(pos) {
            const value = this.canvasCtx.getImageData(pos.x, pos.y, 1, 1).data[1] / 255.0;
            this.probeData = {x: pos.x, y: pos.y, value, freq: 24000*pos.x/this.width};
        },
        getMousePos(evt) {
            //https://stackoverflow.com/questions/43853119/javascript-wrong-mouse-position-when-drawing-on-canvas
            const rect = this.canvas.getBoundingClientRect();
            let coefW = this.canvas.width / rect.width;
            let coefH = this.canvas.height / rect.height;
            return {
                x: Math.round(((evt.clientX / this.canvas.width * rect.width) - rect.left) * coefW),
                y: Math.round(((evt.clientY / this.canvas.height * rect.height) - rect.top) * coefH),
            };
        },
    },
    mounted() {
        this.enable();
    },
    template: `<div>
<canvas ref="canvas2d" style="left: 0; top: 0; padding: 0; margin: 0; border: none; display:block;"  @mousemove="setProbe(getMousePos($event))" @mouseleave="probeData = null"></canvas>
<span v-if="probeData">A({{probeData.freq.toFixed(0)}} Hz) = {{ probeData.value.toFixed(3) }}, -log A = {{ Math.log(probeData.value).toFixed(1) }} ({{probeData.x}}, {{probeData.y}})</span>
</div>`
};

Vue.component('sg-spectrum-visualizer-2d', SGSpectrumVisualizer2D);
