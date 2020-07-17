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

function GenGuitarPeriod2(noteNumber, samplesPerPeriod, pluckDamping = 0.5, pluckDampingVariation = 0.25, velocity = 1.0)
{
    const pluckDampingMin = 0.1;
    const pluckDampingMax = 0.9;
    const pluckDampingVariationMin =  pluckDamping - (pluckDamping - pluckDampingMin) * pluckDampingVariation;
    const pluckDampingVariationMax = pluckDamping + (pluckDampingMax - pluckDamping) * pluckDampingVariation;
    const pluckDampingVariationDifference = pluckDampingVariationMax - pluckDampingVariationMin;
    const pluckDampingCoefficient = pluckDampingVariationMin + Math.random() * pluckDampingVariationDifference;

    let period = new Float32Array(samplesPerPeriod);
    let curInputSample = 0.0;
    for(let i = 0; i < samplesPerPeriod; i++)
    {
        curInputSample *= 1 - pluckDampingCoefficient;
        curInputSample += (Math.random()*2-1)*velocity*pluckDampingCoefficient;
        period[i] = curInputSample;
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

function GenerateWaveWithRandomPhasesOpt(ampls)
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

function GenerateWaveWithRandomPhasesRef(ampls)
{
    const len = ampls.length;
    let real = new Float32Array(len);
    let imag = new Float32Array(len);
    for(let i = 0; i < len/2; i++)
    {
        let rand = Math.random()*6.283;
        real[i] = ampls[i]*Math.cos(rand);
        imag[i] = ampls[i]*Math.sin(rand);
        //real[len-i-1] = real[i];
        //imag[len-i-1] = -imag[i];
    }
    return {real, imag};
}

function GenerateAmplitudesWithRandomPhases(ampls)
{
    if(gState.OptimizePhases) return GenerateWaveWithRandomPhasesOpt(ampls);
    return GenerateWaveWithRandomPhasesRef(ampls);
}

/**
 * Погрешность не превышает 5e-4
 * Формула 7.1.27 из http://people.math.sfu.ca/~cbm/aands/page_299.htm
 * (Abramowitz and Stegun - Handbook of Mathematical Functions.)
 * @return {number}
 */
function ErfApproxForPositive(x)
{
    const x2 = x*x;
    let den = 1 + 0.278393*x + 0.230389*x2 + 0.000972*x2*x + 0.078108*x2*x2;
    den *= den;
    den *= den;
    return 1 - 1 / den;
}

/**
 * @return {number}
 */
function ErfApprox(x)
{
    return ErfApproxForPositive(x < 0? -x: x)*(x < 0? -1: 1);
}

/**
 * @return {number}
 */
function ErfApprox1(x)
{
    const x2 = x*x;
    let xnum = 0.185777706184603153*x2;
    let xden = x2;
    xnum = (xnum + 3.16112374387056560) * x2;
    xden = (xden + 23.6012909523441209) * x2;
    xnum = (xnum + 113.864154151050156) * x2;
    xden = (xden + 244.024637934444173) * x2;
    xnum = (xnum + 377.485237685302021) * x2;
    xden = (xden + 1282.61652607737228) * x2;
    return x * (xnum + 3209.37758913846947) / (xden + 2844.23683343917062);
}


/**
 * @return {number}
 */
function Erfc2(x)
{
    let xnum = 2.15311535474403846e-8 * x;
    let xden = x;
    xnum = (xnum + 0.564188496988670089) * x;
    xden = (xden + 15.7449261107098347) * x;
    xnum = (xnum + 8.88314979438837594) * x;
    xden = (xden + 117.693950891312499) * x;
    xnum = (xnum + 66.1191906371416295) * x;
    xden = (xden + 537.181101862009858) * x;
    xnum = (xnum + 298.635138197400131) * x;
    xden = (xden + 1621.38957456669019) * x;
    xnum = (xnum + 881.952221241769090) * x;
    xden = (xden + 3290.79923573345963) * x;
    xnum = (xnum + 1712.04761263407058) * x;
    xden = (xden + 4362.61909014324716) * x;
    xnum = (xnum + 2051.07837782607147) * x;
    xden = (xden + 3439.36767414372164) * x;
    const result = (xnum + 1230.33935479799725) / (xden + 1230.33935480374942);
    const xfloor = Math.floor(x*16) / 16;
    const del = (x - xfloor) * (x + xfloor);
    return Math.exp(-xfloor*xfloor - del) * result;
}

/**
 * @return {number}
 */
function Erfc3(x)
{
    const x2r = 1 / (x*x);
    let xnum = 0.0163153871373020978 * x2r;
    let xden = x2r;
    xnum = (xnum + 3.05326634961232344e-1) * x2r;
    xden = (xden + 2.56852019228982242e00) * x2r;
    xnum = (xnum + 3.60344899949804439e-1) * x2r;
    xden = (xden + 1.87295284992346047e00) * x2r;
    xnum = (xnum + 1.25781726111229246e-1) * x2r;
    xden = (xden + 5.27905102951428412e-1) * x2r;
    xnum = (xnum + 1.60837851487422766e-2) * x2r;
    xden = (xden + 6.05183413124413191e-2) * x2r;
    let result = x2r * (xnum + 6.58749161529837803e-4) / (xden + 2.33520497626869185e-3);
    result = (1/1.7724538509055159 - result) / x;
    const xfloor = Math.floor(x * 16) / 16;
    const del = (x - xfloor)*(x + xfloor);
    return Math.exp(-xfloor*xfloor - del) * result;
}

/**
 * @return {number}
 */
function Erf(x)
{
    const xAbs = Math.abs(x);
    if(xAbs >= 6) return Math.sign(x);
    if(xAbs <= 0.46875) return ErfApprox1(x);
    if(xAbs <= 4) return Math.sign(x)*(1 - Erfc2(xAbs));
    return Math.sign(x)*(1 - Erfc3(xAbs));
}

/**
 * @return {number}
 */
function ErfTest(x)
{
    if(gState.OptimizeErf === 0) return ErfApprox(x);
    return Erf(x);
}

function AddSineHarmonic(dstAmpls, freqSampleRateRatio, amplitude)
{
    const index = Math.round(freqSampleRateRatio*dstAmpls.length);
    if(index >= dstAmpls.length) return;
    dstAmpls[index] += amplitude*dstAmpls.length;
}

//Добавить "широкую" гармонику к массиву амплитуд dstAmpls.
//Гармоника будет иметь профиль гауссианы с центром, соответствующем желаемой частоте freq*harmonicNumber,
//и шириной bandwidthCents в центах (100 центов - один полутон, 1200 центов - одна октава).
//Необходимо указать частоту осциллятора freqStep - интервал в герцах между соседними элементами массива амплитуд.
//amplitude - громкость гармоники.
//harmonicNumber - номер гармоники, множитель её частоты.
//harmBandwidthScale - степень зависимости ширины гармоники от её номера.
function AddSineHarmonicGauss(dstAmpls, freqSampleRateRatio, baseFreqSampleRateRatio, amplitude, bandwidthCents)
{
    //Это обратный нормирующий коэффициент Width*sqrt(2*pi) в формуле нормального распределения.
    //Пропорционален ширине гармоники - корню дисперсии Width нормального распределения.
    let bwi = (Math.pow(2, bandwidthCents/1200 - 1) - 0.5)*baseFreqSampleRateRatio;

    //Избегаем проблем с точностью при делении на очень маленькое число
    if(bwi < 1e-10)
    {
        AddSineHarmonic(dstAmpls, freqSampleRateRatio, amplitude);
        return;
    }

    //Эта переменная играет роль (x-a) / (Width*sqrt(2)) в формуле нормального распределения
    let rw = -freqSampleRateRatio/bwi;

    //Эта переменная играет роль приращения rw за семпл, что соответствует приращению x в формуле нормального распределения
    const rdw = 1.0/(dstAmpls.length*bwi);

    let startIndex = 0, endIndex = dstAmpls.length/2;

    //Вычислять экспоненту для каждого элемента массива довольно долго, и это самая медленная операция нашего алгоритма,
    //поэтому в качестве оптимизации отбросим те его части, в которых значение гауссианы незначительно.
    let range = 2;
    if(rdw > 1) range = 3*rdw;
    if(-range > rw)
    {
        startIndex = Math.floor((-range - rw) / rdw);
        rw += startIndex*rdw;
    }
    if(rw < range) endIndex = Math.min(endIndex, startIndex + Math.ceil((range - rw) / rdw));

    const ampl = amplitude / bwi;
    /*for(let i = startIndex; i < endIndex; i++)
    {
        dstAmpls[i] += ampl * Math.exp(-rw*rw);
        rw += rdw;
    }*/

    const A = ampl/rdw*0.8862269254527579; //sqrt(PI)/2
    if(!gState.OptimizeErf)
    {
        let erf = Erf(rw);
        for(let i = startIndex; i < endIndex; i++)
        {
            rw += rdw;
            const erfNext = Erf(rw);
            dstAmpls[i] += A*(erfNext - erf);
            erf = erfNext;
        }
        return;
    }
    let erf = ErfApprox(rw);
    for(let i = startIndex; i < endIndex; i++)
    {
        rw += rdw;
        const erfNext = ErfApprox(rw);
        dstAmpls[i] += A*(erfNext - erf);
        erf = erfNext;
    }
    //TODO: убедиться, что интеграл от гармоники почти равен amplitude*dstAmpls.length
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

function CreateGuitarHarmonics(c, bandwidth, bandwidthStep,
                               harmonicStep, harmonicAttenuationPower, freqMult, freqMultStep, numHarmonics, volume)
{
    return CreateHarmonicArray(bandwidth, bandwidthStep, harmonicStep,
        harmonicAttenuationPower, freqMult, freqMult, numHarmonics,
        harmonicNumber => volume*Math.abs((c*(harmonicNumber*harmonicNumber) + 37.0*harmonicNumber) % 397.0 / 200 - 1));
}
