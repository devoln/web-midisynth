"use strict";

function GenGuitarPeriod(samplesPerPeriod, damp)
{
    if(damp === undefined) damp = 0.15;
    let period = new Float32Array(samplesPerPeriod);
    for(let i = 0; i < samplesPerPeriod; i++)
    {
        let sample = i * (samplesPerPeriod - i) / (samplesPerPeriod*samplesPerPeriod/4);
        sample = sample*(1 - sample)*sample*(samplesPerPeriod/2 - i) / (samplesPerPeriod/2);
        sample += (Math.random() * 2 - 1) / ((samplesPerPeriod*4) * (1.0 / (samplesPerPeriod*2) + damp));
        period[i] = sample*5;
    }
    return period;
}

function GenNoisePeriod(numSamples)
{
    let period = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++)
        period[i] = Math.random() * 2 - 1;
    return period;
}

function LowpassFilter(dst, cutoffFreqSampleRateRatio, prevSample = 0)
{
    const alpha = 2*Math.PI*cutoffFreqSampleRateRatio;
    for(let i = 0; i < dst.length; i++)
        dst[i] = prevSample = dst[i]*alpha+prevSample*(1-alpha);
}

const gSineTable = function()
{
    const tableLen = 64;
    let table = new Float32Array(tableLen);
    const PI2_len = 2*Math.PI / tableLen;
    for(let i = 0, t = 1.1357; i < tableLen; i++, t += PI2_len)
        table[i] = Math.sin(t);
    return table;
}();

let gSeed = 157898685;

function GenerateWaveWithRandomPhasesOptInplace(ampls)
{
    const numAmpls = ampls.length >> 1;
    const tableLen = gSineTable.length, tableMask = tableLen-1;
    let seed = gSeed;
    for(let i = numAmpls-2; i >= 0; i++)
    {
        seed = (seed*16807) & 0x7FFFFFFF;
        const icos = ((seed >> 12) + tableLen/4), isin = seed >> 12;
        const coeff = (seed & 0xFFF) / 4096;
        ampls[i*2] = ampls[i]*(gSineTable[icos & tableMask]*(1-coeff) + gSineTable[(icos + 1) & tableMask]*coeff);
        ampls[i*2+1] = ampls[i]*(gSineTable[isin & tableMask]*(1-coeff) + gSineTable[(isin + 1) & tableMask]*coeff);
    }
    gSeed = seed;
    return ampls;
}

function GenerateAmplitudesWithRandomPhases(ampls)
{
    const len = ampls.length;
    const tableLen = gSineTable.length, tableMask = tableLen-1;
    let real = new Float32Array(len);
    let imag = new Float32Array(len);
    let seed = gSeed;

    for(let i = 0; i < len/2; i++)
    {
        seed = (seed*16807) & 0x7FFFFFFF;
        const icos = ((seed >> 12) + tableLen/4), isin = seed >> 12;
        const coeff = (seed & 0xFFF) / 4096;
        real[i] = ampls[i]*(gSineTable[icos & tableMask]*(1-coeff) + gSineTable[(icos + 1) & tableMask]*coeff);
        imag[i] = ampls[i]*(gSineTable[isin & tableMask]*(1-coeff) + gSineTable[(isin + 1) & tableMask]*coeff);
        if(i)
        {
            real[len-i] = real[i];
            imag[len-i] = -imag[i];
        }
    }
    real[len/2] = 0;
    imag[len/2] = 0;
    gSeed = seed;
    return {real, imag};
}

function erfApprox(x)
{
    const x2 = x*x;
    const xabs = Math.abs(x);
    let den = 1 + 0.278393*xabs + 0.230389*x2 + 0.000972*x2*xabs + 0.078108*x2*x2;
    den *= den;
    den *= den;
    const res = 1 - 1 / den;
    if(x < 0) return -res;
    return res;
}

function AddSineHarmonic(dstAmpls, freqSampleRateRatio, amplitude)
{
    const index = Math.round(freqSampleRateRatio*dstAmpls.length);
    if(index >= dstAmpls.length) return;
    dstAmpls[index] += amplitude*dstAmpls.length;
}

function AddSineHarmonicGauss(dstAmpls, freqSampleRateRatio, baseFreqSampleRateRatio, amplitude, bandwidthCents)
{
    // This is Sigma*sqrt(2*PI) in the normal distribution formula
    let bwi = (Math.pow(2, bandwidthCents/1200 - 1) - 0.5)*baseFreqSampleRateRatio;

    // Avoid FP-precision problems
    if(bwi < 1e-10)
    {
        AddSineHarmonic(dstAmpls, freqSampleRateRatio, amplitude);
        return;
    }

    // This is (x-a) / (Sigma*sqrt(2)) in the normal distribution formula
    let rw = -freqSampleRateRatio/bwi;

    // This is a delta for rw per sample. Corresponds to x in the normal distribution formula
    const rdw = 1.0 / (dstAmpls.length*bwi);

    let startIndex = 0, endIndex = dstAmpls.length / 2;

    // Optimization: avoid evaluating gauss where it is close to zero
    let range = 2;
    if(rdw > 1) range = 3*rdw;
    if(-range > rw)
    {
        startIndex = Math.floor((-range - rw) / rdw);
        rw += startIndex*rdw;
    }
    if(rw < range) endIndex = Math.min(endIndex, startIndex + Math.ceil((range - rw) / rdw));

    const ampl = amplitude / bwi;
    const A = ampl/rdw*0.8862269254527579; //sqrt(PI)/2
    let erf = erfApprox(rw);
    for(let i = startIndex; i < endIndex; i++)
    {
        rw += rdw;
        const erfNext = erfApprox(rw);
        dstAmpls[i] += A*(erfNext - erf);
        erf = erfNext;
    }
}

function WaveTableGeneratorFromHarmonics(harmonicSets, tableSize)
{
    return function(freq)
    {
        let ampls = new Float32Array(tableSize);
        const baseFreqSampleRateRatio = freq/gAudioCtx.sampleRate;
        let finalHarmonics = [];
        let amplSum = 0;
        for(let j = 0; j < harmonicSets.length; j++)
        {
            const harmonicSet = harmonicSets[j];
            const harmonics = harmonicSet.Harmonics;
            const len = harmonics.length;
            const harmonicFreqLimit = harmonicSet.FreqLimit || gAudioCtx.sampleRate/2;
            for(let i = 0; i < len; i++)
            {
                const harm = harmonics[i];
                const ifreq = harm.FreqMultiplier*freq;
                if(ifreq > harmonicFreqLimit) break; //Предполагается, что гармоники идут в порядке неубывания частоты

                let amplitude = harm.Amplitude;
                if(harmonicSet.Resonances)
                {
                    const resonances = harmonicSet.Resonances;
                    let res = 0;
                    for(let f = 0; f < resonances.length; f++)
                    {
                        const resonance = resonances[f];
                        const x = (ifreq - resonance.Frequency) / resonance.Width;
                        res += resonance.Amplitude*Math.exp(-0.5*x*x)/(2.507*resonance.Width);
                    }
                    if(harmonicSet.IsResonanceMultiplicative) amplitude *= res;
                    else amplitude += res;
                }
                finalHarmonics.push([baseFreqSampleRateRatio*harm.FreqMultiplier, amplitude, harm.Bandwidth]);
                amplSum += amplitude;
            }
        }
        amplSum *= tableSize;
        for(let i = 0; i < finalHarmonics.length; i++)
            AddSineHarmonicGauss(ampls, finalHarmonics[i][0], baseFreqSampleRateRatio, finalHarmonics[i][1]/amplSum, finalHarmonics[i][2]);
        let complexAmpls = GenerateAmplitudesWithRandomPhases(ampls);
        let complexRes = InplaceInverseFFTNonNormalized(complexAmpls.real, complexAmpls.imag);
        return complexRes.real;
    };
}

function CompileFormula(formula)
{
    if(!isNaN(formula)) return x => formula;
    // TODO: validate formula, forbid any identifier except x, rand, abs, sqrt, pow, sin, cos
    if(!/^[a-zA-Z0-9%*)(/+.,\s-]+$/g.test(formula))
    {
        console.error(`Invalid formula "${formula}!"`);
        return;
    }
    return Function(`"use strict";
    const abs=Math.abs, sqrt=Math.sqrt, pow=Math.pow, exp=Math.exp, sin=Math.sin, cos=Math.cos, log2=Math.log2, max=Math.max, min=Math.min, PI=Math.PI;
    return x => {const rand = Math.random(); return ${formula}};`)();
}

function CreateHarmonicArray(harmonicSeries)
{
    let harmonics = [];
    const bandwidth = CompileFormula(harmonicSeries.Bandwidth || 0.001);
    const amplitude = CompileFormula(harmonicSeries.Amplitude || "1/x");
    const freqMult = CompileFormula(harmonicSeries.FreqMultiplier || "x");
    for(let i = 1, numHarmonics = harmonicSeries.NumHarmonics || 128; i <= numHarmonics; i++)
    {
        harmonics.push({
            Amplitude: amplitude(i),
            FreqMultiplier: freqMult(i),
            Bandwidth: bandwidth(i),
        });
    }
    return harmonics;
}
