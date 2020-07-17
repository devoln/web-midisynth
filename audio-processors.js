"use strict";

class KarplusStrongProcessor extends AudioWorkletProcessor
{
    constructor() {
        super();
        this.port.onmessage = event => {
            this.period = event.data.period;
            this.periodPos = 0;
            console.log(event.data);
        };
    }

    process(inputs, outputs, parameters)
    {
        const output = outputs[0];
        for (let i = 0, len = output[0].length; i < len; i++)
        {
            //TODO: Karplus-Strong
            output[0][i] = Math.random() * 2 - 1;
            output[1][i] = Math.random() * 2 - 1;
        }
        return true
    }
}

registerProcessor('karplus-strong-processor', KarplusStrongProcessor);
