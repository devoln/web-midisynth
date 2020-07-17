"use strict";

function CachedWaveGenerator(waveGenerator)
{
	let waveTableCache = [];
	return function(freq) {
		if(!waveTableCache[freq])
			waveTableCache[freq] = waveGenerator(freq);
		const res = waveTableCache[freq];
		console.log("max sample value: " + Math.max.apply(null, res));
		console.log("avg sample value: " + res.reduce((a, b) => Math.abs(a) + Math.abs(b), 0)/res.length);
		return waveTableCache[freq];
	}
}

function GuitarWaveGenerator(params, karplusStrong)
{
	return function(freq) {
		if(params.Detune) freq *= Math.pow(2, params.Detune / 1200.0);
		const samplesPerPeriodPrecise = gAudioCtx.sampleRate / freq - karplusStrongGetSmoothFactor(karplusStrong, freq);
		const samplesPerPeriod = Math.round(samplesPerPeriodPrecise);
		let playbackSpeed = samplesPerPeriod / samplesPerPeriodPrecise;
		//const note = Math.log2(freq / 16.352)*12;
		//let samples = GenGuitarPeriod2(note, samplesPerPeriod);
		let samples = GenGuitarPeriod(samplesPerPeriod, params.Damping);
		//let samples = GenNoisePeriod(samplesPerPeriod);
		if(params.CutoffFrequency) LowpassFilter(samples, params.CutoffFrequency/gAudioCtx.sampleRate, samples[samples.length-1]);
		return {
			samples,
			playbackSpeed
		};
		//return GenBetterGuitarPeriod(note, samplesPerPeriod);
	}
}

function karplusStrongGetSmoothFactor(ks, freq)
{
	if(!ks) return 0;
	if(!ks._SmoothFactorFunc) ks._SmoothFactorFunc = CompileFormula(ks.SmoothFactor);
	return ks._SmoothFactorFunc(freq);
}

function InitInstrument(instr)
{
	if(Array.isArray(instr))
	{
		for(let i = 0; i < instr.length; i++) InitInstrument(instr[i]);
		instr.PlayNote = function(freq, velocity, when = 0, audioCtx, destinationNode)
		{
			when = Math.max(when, audioCtx.currentTime+0.01);
			for(let i = 0; i < instr.length; i++) instr[i].PlayNote(freq, velocity, when, audioCtx, destinationNode);
		};
		return;
	}
	instr.TableSize = instr.TableSize || 16384;
	instr.Cache = {};

	// Заполняем все опциональные поля ADSR
	if(!instr.Envelope) instr.Envelope = {};
	if(!instr.Envelope.Exp) instr.Envelope.Exp = 0;
	if(!instr.Envelope.ExpExpBase) instr.Envelope.ExpExpBase = 0;
	if(!instr.Envelope.ExpExpK) instr.Envelope.ExpExpK = 0;
	if(!instr.Envelope.Segments)
	{
		instr.Envelope.Segments = [];
		instr.Envelope.Volume = [];
	}
	if(!instr.Envelope.Volume || instr.Envelope.Volume.length === 0) instr.Envelope.Volume = [1];
	if(instr.Envelope.Segments.length === 0) //Добавить нулевую фазу Release, если отсутствует
	{
		instr.Envelope.Segments.push(0);
		instr.Envelope.Volume.push(0);
	}
	if(instr.Envelope.Segments.length === 1) //Добавить нулевую фазу Attack, если отсутствует
	{
		instr.Envelope.Segments.unshift(0);
		instr.Envelope.Volume.unshift(instr.Envelope.Volume[0]);
	}
	if(instr.Envelope.Segments.length === 2) //Добавить нулевую фазу Decay, если отсутствует
	{
		instr.Envelope.Segments.unshift(instr.Envelope.Segments[0]);
		instr.Envelope.Volume.unshift(instr.Envelope.Volume[0]);
		instr.Envelope.Volume[1] = instr.Envelope.Volume[2];
		instr.Envelope.Segments[1] = 0;
	}

	if(instr.KarplusStrong) instr.Cache.Filter = function(dst, input, freq) {
		FilterKS(dst, input, karplusStrongGetSmoothFactor(instr.KarplusStrong, freq));
	};
	else if(instr.Envelope.ExpExpK && instr.Envelope.ExpExpBase)
	{
		const step = 256;
		let dmus = GenSmoothCoeffTableExpExp(1-instr.Envelope.ExpExpBase, instr.Envelope.ExpExpK, 1024, step);
		instr.Cache.Filter = function(dst, input, freq)
		{
			Filter(dst, input, step, dmus);
		};
	}
	/*else instr.Cache.Filter = function(dst, input, freq)
	{
		for (let i = 0, len = dst.length; i < len; i += input.length)
			dst.set(input.subarray(0, Math.min(input.length, len - i)), i);
	};*/

	for(let j = 0, hsLen = instr.HarmonicSets? instr.HarmonicSets.length: 0; j < hsLen; j++)
	{
		const hs = instr.HarmonicSets[j];
		if(!hs.HarmonicsSeries) continue;
		hs.Harmonics = [];
		for(let i = 0, len = hs.HarmonicsSeries.length; i < len; i++)
		{
			if(!hs.HarmonicsSeries[i].AttenuationPower) hs.HarmonicsSeries[i].AttenuationPower = 1;
			hs.Harmonics = hs.Harmonics.concat(CreateHarmonicArray(hs.HarmonicsSeries[i]));
		}
		hs.Harmonics.sort((h1, h2) => h1.FreqMultiplier - h2.FreqMultiplier);
	}

	if(instr.HarmonicSets)
		instr.Cache.PeriodicWaveGenerator = CachedWaveGenerator(WaveTableGeneratorFromHarmonics(instr.HarmonicSets, instr.TableSize));
	else if(instr.StringWaveForm)
		instr.Cache.PeriodicWaveGenerator = GuitarWaveGenerator(instr.StringWaveForm, instr.KarplusStrong);
	else if(instr.NoiseWaveform) instr.Cache.PeriodicWaveGenerator = function(freq) {
		let samples = GenNoisePeriod(instr.TableSize);
		LowpassFilter(samples, freq/GetAudioContext().sampleRate);
		return {samples};
	};
	instr.PlayNote = function(freq, velocity, when = 0, audioCtx, destinationNode)
	{
		if(!audioCtx) audioCtx = GetAudioContext();
		if(!destinationNode) destinationNode = audioCtx.dest;
		const t0 = performance.now();
		const wave = this.Cache.PeriodicWaveGenerator(freq, velocity);
		const t1 = performance.now();
		const playbackSpeed = wave.playbackSpeed || 1;
		const input = wave.samples || wave;

		const t2 = performance.now();
		let audioBuffer;
		let loop = true;
		let offset = 0;
		let volume = Math.exp(velocity-1)*this.Volume;
		if(this.Cache.Filter)
		{
			audioBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate*8, audioCtx.sampleRate);
			let dst = audioBuffer.getChannelData(0);
			this.Cache.Filter(dst, input, freq);
			loop = false;
		}
		else {
			if(!wave.audioBuffer) {
				wave.audioBuffer = audioCtx.createBuffer(1, input.length, audioCtx.sampleRate);
				wave.audioBuffer.copyToChannel(input, 0);
			}
			audioBuffer = wave.audioBuffer;
			offset = Math.random()*audioBuffer.duration;
		}
		const t3 = performance.now();

		let source = audioCtx.createBufferSource();
		source.buffer = audioBuffer;
		source.playbackRate.value = playbackSpeed;
		source.loop = loop;
		when = Math.max(when, audioCtx.currentTime+0.001);

		if(this.Vibrato)
		{
			let lfo = audioCtx.createOscillator();
			lfo.frequency.value = this.Vibrato.Frequency;
			let lfoGain = audioCtx.createGain();
			let t = when;
			if(this.Vibrato.Segments)
			{
				lfoGain.gain.setValueAtTime(this.Vibrato.Value[0], when);
				for(let i = 0; i < this.Vibrato.Segments.length; i++)
				{
					t += this.Vibrato.Segments[i];
					lfoGain.gain.linearRampToValueAtTime(this.Vibrato.Value[i+1], t);
				}
			}
			lfo.connect(lfoGain).connect(source.detune);
			lfo.start();
		}

		let gainSrc = source;
		if(this.Envelope.Exp)
		{
			let expGain = audioCtx.createGain();
			expGain.gain.setValueAtTime(1, when);
			let t0 = -Math.log(1e-20)/this.Envelope.Exp;
			expGain.gain.exponentialRampToValueAtTime(1e-20, when + t0);
			source.connect(expGain);
			gainSrc = expGain;
		}

		let t = when;
		let biquadFilter;
		if(this.Envelope.CutoffFreq)
		{
			biquadFilter = audioCtx.createBiquadFilter();
			biquadFilter.type = 'lowpass';
			biquadFilter.frequency.setValueAtTime(Math.max(this.Envelope.CutoffFreq[0], 1), t);
		}

		let gain = audioCtx.createGain();
		let initialGainValue = this.Envelope.Volume[0]*volume;
		gain.gain.value = initialGainValue;
		gainSrc.connect(gain);
		if(this.Envelope.ExponentialInterpolation) initialGainValue = Math.max(initialGainValue, 1e-20);
		gain.gain.setValueAtTime(initialGainValue, t);
		for(let i = 0; i < this.Envelope.Segments.length-1; i++)
		{
			if(this.Envelope.Segments[i] === 0) continue;
			t += this.Envelope.Segments[i];
			const nextValue = this.Envelope.Volume[i+1]*volume;
			if(this.Envelope.ExponentialInterpolation) gain.gain.exponentialRampToValueAtTime(Math.max(nextValue, 1e-20), t);
			else gain.gain.linearRampToValueAtTime(nextValue, t);

			if(this.Envelope.CutoffFreq) biquadFilter.frequency.linearRampToValueAtTime(Math.max(this.Envelope.CutoffFreq[i+1], 1), t);
		}
		if(biquadFilter)
		{
			gain.connect(biquadFilter);
			biquadFilter.connect(destinationNode);
		}
		else gain.connect(destinationNode);
		source.gain = gain.gain;
		source.instrument = this;

		source.start(when, offset);
		source.NoteOff = (when) => {
			let t = when || audioCtx.currentTime;
			source.gain.cancelScheduledValues(t);
			source.gain.setValueAtTime(source.gain.value, t);
			t += this.Envelope.Segments[this.Envelope.Segments.length-1];
			source.gain.linearRampToValueAtTime(0, t);
			if(this.Envelope.CutoffFreq) biquadFilter.frequency.linearRampToValueAtTime(Math.max(this.Envelope.CutoffFreq[this.Envelope.CutoffFreq.length-1], 1), t);
			source.stop(t);
		};
		const t4 = performance.now();
		console.log(`${t4-t0} ms = (${t1-t0}) + ${t2-t1} + (${t3-t2}) + ${t4-t3}`);
		return source;
	}
}

function GetNonUniformSpline(f, dt, t0, tN, N)
{
	let t = t0;
	let res = [{t, y: f(t0)}];
	const maxDeltaDfPerPoint = (f(tN) - f(tN-dt) - f(t0 + dt) + f(t0)) / (dt * N);
	let leftDeltaPerPoint = maxDeltaDfPerPoint;
	for(let i = 0; i < N; i++)
	{
		const deltaPerPoint = (f(t + dt) - f(t)) / dt;
		t += dt;
		res.push({t, y});
	}
	return res;
}

function GenSmoothCoeffTableExpExp(amul, k, len, step) {
	let res = [1];
	amul = Math.pow(amul, step);
	let a = k, emk = Math.exp(-k), prevmu = 1;
	while(--len)
	{
		a *= amul;
		const mu = Math.exp(a)*emk;
		res.push((mu-prevmu) / step);
		prevmu = mu;
	}
	return res;
}

function GenSmoothCoeffTableExp(amul, k, len, step) {
	let res = [1];
	amul = Math.pow(amul, step);
	let a = k, emk = Math.exp(-k), prevmu = 1;

	while(--len)
	{
		a *= amul;
		const mu = Math.exp(a)*emk; //emk*Math.exp(k/(1+i/48000.0))
		res.push((mu-prevmu) / step);
		prevmu = mu;
	}
	return res;
}



function Filter(dst, input, step, dmus)
{
	let PrevSample = 0;
	let mu = dmus[0], dmu = 0;
	for (let m = 0, i = 0, j = 0, len = dst.length, its = Math.ceil(len / step); m < its; m++)
	{
		if(m+1 < dmus.length) dmu = dmus[m+1];
		if(dmu < -mu / step) dmu = -mu / step;
		for (let p = 0; p < step; p++, i++, j++)
		{
			if(j >= input.length) j = 0;
			const sample = PrevSample*(1-mu)+input[j]*mu;
			dst[i] = PrevSample = sample;
			mu += dmu;
		}
	}
}

function FilterKS(dst, input, smoothFactor)
{
	const ilen = dst.length, jlen = input.length;
	let PrevSample = 0;
	const omsf = 1 - smoothFactor;
	for (let i = 0; i < ilen;)
	{
		const its = Math.min(jlen, ilen-i);
		for(let j = 0; j < its; i++, j++)
		{
			PrevSample = input[j]*omsf+PrevSample*smoothFactor;
			input[j] = PrevSample;
			dst[i] = PrevSample;
		}
	}
}

function FilterExp(dst, input, k, a)
{
	let PrevSample = 0;
	for (let i = 0, j = 0, len = dst.length; i < len; i++, j++)
	{
		if(j >= input.length) j = 0;
		const mu = Math.exp(-k*(1 - 1/(1+i/48000.0)));//Math.exp(k*(Math.pow(a, i)-1));
		const sample = PrevSample*(1-mu)+input[j]*mu;
		dst[i] = PrevSample = sample;
	}
}
