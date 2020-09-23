"use strict";

const gInstruments = {
	AcousticGuitarNylon: {
		Envelope: {
			Segments: [0.7],
			Volume: [1, 0],
			Exp: 1.5,
		},
		StringWaveForm: {
			Damping: 0.15,
		},
		Volume: 0.55,
		KarplusStrong: {
			SmoothFactor: "0.15*(0.9 - sqrt(log2(x / 16.352) * 12 / 128)*0.8 + rand*0.1)",
		}
	},
	AcousticGuitarSteel: {
		Envelope: {
			Segments: [0.7],
			Volume: [1, 0],
			Exp: 1,
		},
		StringWaveForm: {
			Damping: 0.05,
		},
		Volume: 0.4,
		KarplusStrong: {
			SmoothFactor: "0.25*(0.9 - sqrt(log2(x / 16.352) * 12 / 128)*0.8 + rand * 0.1)",
		}
	},
	AcousticPiano: {
		Envelope: {
			Segments: [0.7],
			Volume: [1, 0],
			Exp: 2,
		},
		StringWaveForm: {
			Damping: 0.07,
		},
		Volume: 0.45,
		KarplusStrong: {
			//SmoothFactor: "0.11*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.25)*0.7 + rand * 0.1)",
			//SmoothFactor: "0.2*(0.5 - pow(log2(x / 16.352) * 12 / 128, 0.5)*0.45 + rand * 0.1)",
			//SmoothFactor: "0.12*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.25)*0.7 + rand * 0.1)",
			SmoothFactor: "0.29*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.17)*0.89 + rand * 0.1)",
		}
	},
	BrightAcousticPiano: {
		Envelope: {
			Segments: [0.7],
			Volume: [1, 0],
			Exp: 2,
		},
		StringWaveForm: {
			Damping: 0.04,
		},
		Volume: 0.35,
		KarplusStrong: {
			SmoothFactor: "0.31*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.17)*0.89 + rand * 0.1)",
		}
	},
	ElectricGuitarJazz: {
		Envelope: {
			Segments: [0.1],
			Volume: [1, 0],
			Exp: 1,
		},
		StringWaveForm: {
			Damping: 0.25,
		},
		Volume: 0.85,
		KarplusStrong: {
			SmoothFactor: "0.4*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.2)*0.7 + rand * 0.1)",
		}
	},
	ElectricGuitarClean: {
		Envelope: {
			Segments: [0.1],
			Volume: [1, 0],
			Exp: 1.5,
		},
		StringWaveForm: {
			Damping: 0.015,
		},
		Volume: 0.2,
		KarplusStrong: {
			SmoothFactor: "0.35*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.4)*0.8 + rand * 0.1)",
		}
	},
	ElectricGuitarMuted: {
		Envelope: {
			Segments: [0.2],
			Volume: [1, 0],
			Exp: 1,
		},
		StringWaveForm: {
			Damping: 0.2,
		},
		Volume: 0.7,
		KarplusStrong: {
			SmoothFactor: "0.3*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.2)*0.7 + rand * 0.1)",
		}
	},
	Sitar: {
		Envelope: {
			Segments: [0.003, 0, 0.4],
			Volume: [0, 1, 1, 0],
			Exp: 0.2,
		},
		StringWaveForm: {
			Damping: 0.02,
		},
		Volume: 0.35,
		KarplusStrong: {
			SmoothFactor: "0.12*(0.9 - pow(log2(x / 16.352) * 12 / 128, 0.4)*0.8 + rand * 0.1)",
		}
	},
	AcousticBass: { //TODO: пока гитара, превратить в басс
		Envelope: {
			Segments: [0.3],
			Volume: [1, 0],
			Exp: 1.5,
		},
		StringWaveForm: {
			Damping: 0.03,
		},
		Volume: 0.2,
		KarplusStrong: {
			SmoothFactor: "0.15*(0.9 - sqrt(log2(x / 16.352) * 12 / 128)*0.8 + rand*0.1)",
		}
	},
	ChoirAahs: {
		Envelope: {
			Segments: [0.1, 0.1, 0.4],
			Volume: [0, 1, 0.7, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "70+70*x",
				Amplitude: "1/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25},
				{Frequency: 900, Width: 175, Amplitude: 1.95},
				{Frequency: 2200, Width: 150, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4},
				{Frequency: 0, Width: 2000, Amplitude: 7.5},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 16384,
		Volume: 0.4,
	},
	ChoirA: {
		Envelope: {
			Segments: [0.1, 0.1, 0.4],
			Volume: [0, 1, 0.7, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 100,
				Bandwidth: "60+20*x",
				Amplitude: "(0.8-0.8*rand*x/100)/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25},
				{Frequency: 900, Width: 175, Amplitude: 1.95},
				{Frequency: 2200, Width: 150, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4},
				{Frequency: 0, Width: 2000, Amplitude: 7.5},
			],
		}],
		TableSize: 16384,
		Volume: 0.4,
	},
	SynthVoice: {
		Envelope: {
			Segments: [0.04, 0, 0.1],
			Volume: [0, 1, 1, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25}, //350—700 Гц
				{Frequency: 900, Width: 230, Amplitude: 1.95},
				{Frequency: 2200, Width: 840, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4}, //2400-3200 Гц (30-40% м, 15-30% ж)
				{Frequency: 0, Width: 2000, Amplitude: 0.75},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.2,
	},
	VoiceOohs: {
		Envelope: {
			Segments: [0.005, 0.3, 0.2],
			Volume: [0, 1, 0.6, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25}, //350—700 Гц
				{Frequency: 900, Width: 230, Amplitude: 1.95},
				{Frequency: 2200, Width: 840, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4}, //2400-3200 Гц (30-40% м, 15-30% ж)
				{Frequency: 0, Width: 2000, Amplitude: 0.75},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.25,
	},
	Pad4Choir: {
		Envelope: {
			Segments: [0.1, 0.1, 0.4],
			Volume: [0, 1, 0.4, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25}, //350—700 Гц
				{Frequency: 900, Width: 230, Amplitude: 1.95},
				{Frequency: 2200, Width: 840, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4}, //2400-3200 Гц (30-40% м, 15-30% ж)
				{Frequency: 0, Width: 2000, Amplitude: 0.75},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.65,
	},
	Pad7Halo: {
		Envelope: {
			Segments: [0.03, 0.5, 0.3],
			Volume: [0, 1, 0.7, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25}, //350—700 Гц
				{Frequency: 900, Width: 230, Amplitude: 1.95},
				{Frequency: 2200, Width: 840, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4}, //2400-3200 Гц (30-40% м, 15-30% ж)
				{Frequency: 0, Width: 2000, Amplitude: 0.75},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.6,
	},
	Pad8Sweep: {
		Envelope: {
			Segments: [0.015, 0, 0.25],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 100,
				Bandwidth: "40+40*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.15,
	},
	StringEnsemble2: {
		Envelope: {
			Segments: [0.007, 0, 0.15],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 100,
				Bandwidth: "40+40*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.15,
	},
	SynthStrings: {
		Envelope: {
			Segments: [0.3, 0.2],
			Volume: [0, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.2,
	},
	SynthStrings3: {
		Envelope: {
			Segments: [0.3, 0.3],
			Volume: [0, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 100,
				Bandwidth: "50+15*x",
				Amplitude: "(0.8-0.1*rand*sqrt(x))/(x*x)",
			}],
			Resonances: [
				{Frequency: 400, Width: 35, Amplitude: 87},
				{Frequency: 900, Width: 115, Amplitude: 195},
				{Frequency: 1400, Width: 115, Amplitude: 60},
				{Frequency: 2200, Width: 345, Amplitude: 1320},
				{Frequency: 3500, Width: 140, Amplitude: 35},
				{Frequency: 6000, Width: 2500, Amplitude: 460},
				{Frequency: 0, Width: 7, Amplitude: 2},
			],
		}],
		TableSize: 32768,
		Volume: 0.1,
	},
	StringEnsemble: {
		Envelope: {
			Segments: [0.3, 0.2],
			Volume: [0, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "35+30*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.25,
	},
	TremoloStrings: {
		Envelope: {
			Segments: [0.01, 0.07],
			Volume: [0, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.25,
	},
	RockOrgan: {
		Envelope: {
			Segments: [0.001, 0.6, 0.05],
			Volume: [0, 1, 0.1, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Vibrato: {
			Segments: [0.2, 0.5],
			Value: [0, 3, 7],
			Frequency: 5,
		},
		Volume: 0.4,
	},
	Harmonica: {
		Envelope: {
			Segments: [0.01, 0.01],
			Volume: [0, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 16,
				Bandwidth: "1+x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 16384,
		Volume: 0.15,
	},
	Fiddle: {
		Envelope: {
			Segments: [0.03, 0.04],
			Volume: [0, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 16,
				Bandwidth: "4+4*x",
				Amplitude: "1/sqrt(x)",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 16384,
		Volume: 0.15,
	},
	PizzicatoStrings: {
		Envelope: {
			Segments: [0.02, 0.2, 0.07],
			Volume: [0, 1, 0.3, 0],
			Exp: 6,
			ExponentialInterpolation: false,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 16,
				Bandwidth: "4+4*x",
				Amplitude: "1/sqrt(x)",
				//NumHarmonics: 100,
				//Bandwidth: 0.1,
				//Amplitude: "0.8*(1-rand*0.5)/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 50, Amplitude: 0.35},
				{Frequency: 800, Width: 315, Amplitude: 2.5},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 0, Width: 0.1, Amplitude: 0.001},
				/*{Frequency: 400, Width: 85, Amplitude: 8.7},
				{Frequency: 900, Width: 115, Amplitude: 19.5},
				{Frequency: 1400, Width: 115, Amplitude: 6},
				{Frequency: 2200, Width: 300, Amplitude: 7},
				{Frequency: 3500, Width: 240, Amplitude: 2},
				{Frequency: 10000, Width: 4500, Amplitude: 20},*/
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	PercussiveOrgan: {
		Envelope: {
			Segments: [0.008, 0.2, 0.05],
			Volume: [0, 1, 0.6, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 64,
				Bandwidth: "40+40*x",
				Amplitude: "1/(x*x)",
			}],
			Resonances: [
				{Frequency: 600, Width: 100, Amplitude: 1.25}, //350—700 Гц
				{Frequency: 900, Width: 230, Amplitude: 1.95},
				{Frequency: 2200, Width: 840, Amplitude: 3.5},
				{Frequency: 2600, Width: 175, Amplitude: 4.4}, //2400-3200 Гц (30-40% м, 15-30% ж)
				{Frequency: 0, Width: 2000, Amplitude: 0.75},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.25,
	},
	Violin: {
		Envelope: {
			Segments: [0.05, 0.03, 0.05],
			Volume: [0, 1, 0.8, 0],
			//CutoffFreq: [20000, 20000, 20000, 1000],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 100,
					Bandwidth: 0.1,
					Amplitude: "0.8*(1-rand*0.5)/x",
				},
				{
					NumHarmonics: 100,
					Bandwidth: 1200,
					Amplitude: "0.2*(1-rand*0.7)/x",
				}
			],
			Resonances: [
				{Frequency: 400, Width: 85, Amplitude: 8.7},
				{Frequency: 900, Width: 115, Amplitude: 19.5},
				{Frequency: 1400, Width: 115, Amplitude: 6},
				{Frequency: 2200, Width: 300, Amplitude: 7},
				{Frequency: 3500, Width: 240, Amplitude: 2},
				{Frequency: 10000, Width: 4500, Amplitude: 20},
				//{Frequency: 0, Width: 7, Amplitude: 2},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Vibrato: {
			Segments: [0.6, 0.5],
			Value: [0, 3, 12],
			Frequency: 6,
		},
		Volume: 0.2,
	},
	ViolinOld: {
		Envelope: {
			Segments: [0.05, 0.03, 0.05],
			Volume: [0, 1, 0.8, 0],
			//CutoffFreq: [20000, 20000, 20000, 1000],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 100,
					Bandwidth: 0.1,
					Amplitude: "0.8*(1-rand*0.5)/x",
				},
			],
			Resonances: [
				{Frequency: 500, Width: 50, Amplitude: 12.5},
				{Frequency: 800, Width: 315, Amplitude: 76},
				{Frequency: 2100, Width: 1400, Amplitude: 420},
				{Frequency: 3700, Width: 1750, Amplitude: 440},
				{Frequency: 0, Width: 7, Amplitude: 1.75},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Vibrato: {
			Segments: [0.6, 0.5],
			Value: [0, 3, 12],
			Frequency: 6,
		},
		Volume: 0.2,
	},
	SynthBrass: {
		Envelope: {
			Segments: [0.01, 0.4, 0.1],
			Volume: [0, 1, 0.3, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 40,
					Bandwidth: "7*(1+0.8*x)",
					Amplitude: "pow(x, -1.5)",
				},
			],
		}],
		TableSize: 16384,
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 3, 12],
			Frequency: 12,
		},
		Volume: 0.3,
	},
	BrassSection: {
		Envelope: {
			Segments: [0.02, 0, 0.03],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 40,
					Bandwidth: "7*(1+0.8*x)",
					Amplitude: "pow(x, -1.5)",
				},
			],
		}],
		TableSize: 16384,
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 6, 20],
			Frequency: 5,
		},
		Volume: 0.25,
	},
	Pad3Polysynth: {
		Envelope: {
			Segments: [0.01, 0, 0.15],
			Volume: [0, 1, 1, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 40,
					Bandwidth: "7*(1+0.8*x)",
					Amplitude: "pow(x, -1.5)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.1,
	},
	Fx1Rain: {
		Envelope: {
			Segments: [0.003, 0.05, 0.2],
			Volume: [0, 1, 0.3, 0],
			Exp: 1,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 40,
					Bandwidth: "7*(1+0.8*x)",
					Amplitude: "pow(x, -1.5)",
				},
			],
		}],
		TableSize: 16384,
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 7, 12],
			Frequency: 25,
		},
		Volume: 0.45,
	},
	SteelDrums: { //TODO: это заглушка, подобрать что-то нормальное
		Envelope: {
			Segments: [0.005, 0.3, 0.2],
			Volume: [0, 1, 0.7, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 40,
					Bandwidth: "2+5*x",
					Amplitude: "pow(x, -1.5)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.3,
	},
	Fx6Goblins: {
		Envelope: {
			Segments: [0.05, 0, 0.15],
			Volume: [0, 1, 1, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 40,
					Bandwidth: "2+5*x",
					Amplitude: "pow(x, -1.5)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.07,
	},
	Clav: {
		Envelope: {
			Segments: [0.008, 0, 0.01],
			Volume: [0, 1, 1, 0],
			Exp: 6,
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "1.2*x",
					Amplitude: "cos(PI*(x/26-0.5))/(x*x)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.12,
	},
	OrchestraHit: {
		Envelope: {
			Segments: [0.015, 0.15, 0.1],
			Volume: [0, 1, 0.4, 0],
			Exp: 3,
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 100,
					Bandwidth: "52*x-20",
					Amplitude: "pow(x, -0.4)",
				},
			],
			Resonances: [
				{Frequency: 275, Width: 700, Amplitude: 175},
				{Frequency: 1150, Width: 1400, Amplitude: 420},
				{Frequency: 2500, Width: 700, Amplitude: 175},
				{Frequency: 4100, Width: 175, Amplitude: 44},
				{Frequency: 0, Width: 2100, Amplitude: 525},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.2,
	},
	Calliope: {
		Envelope: {
			Segments: [0.015, 0, 0.03],
			Volume: [0, 1, 1, 0],
			//CutoffFreq: [20000, 20000, 20000, 100],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "24*x-14",
					Amplitude: "1/x",
				},
			],
			Resonances: [
				{Frequency: 275, Width: 700, Amplitude: 175},
				{Frequency: 650, Width: 1400, Amplitude: 420},
				{Frequency: 1100, Width: 700, Amplitude: 175},
				{Frequency: 2700, Width: 250, Amplitude: 62.5},
				{Frequency: 0, Width: 2100, Amplitude: 52.5}
			],
		}],
		TableSize: 16384,
		Volume: 0.25,
	},


	Vibraphone: {
		Envelope: {
			Segments: [0.004, 0.05, 0.25],
			Volume: [0, 1, 0.3, 0],
			Exp: 2,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 2},
				{Amplitude: 0.25, FreqMultiplier: 4, Bandwidth: 15},
				{Amplitude: 0.125, FreqMultiplier: 8, Bandwidth: 25},
				{Amplitude: 0.0625, FreqMultiplier: 16, Bandwidth: 45},
				{Amplitude: 0.03125, FreqMultiplier: 32, Bandwidth: 58},
			],
		}],
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 5, 17],
			Frequency: 5,
		},
		TableSize: 16384,
		Volume: 0.15,
	},
	MusicBox: {
		Envelope: {
			Segments: [0.01, 0.08, 0.4],
			Volume: [0, 1, 0.5, 0],
			Exp: 4,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 20},
				{Amplitude: 0.5, FreqMultiplier: 4, Bandwidth: 15},
				{Amplitude: 0.25, FreqMultiplier: 8, Bandwidth: 15},
				{Amplitude: 0.125, FreqMultiplier: 16, Bandwidth: 15},
				{Amplitude: 0.0625, FreqMultiplier: 32, Bandwidth: 15}
			],
		}],
		TableSize: 16384,
		Volume: 0.1,
	},
	Marimba: {
		Envelope: {
			Segments: [0.005, 0.05, 0.3],
			Volume: [0, 1, 0.3, 0],
			Exp: 5,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 8},
				{Amplitude: 0.25, FreqMultiplier: 4, Bandwidth: 9},
				{Amplitude: 0.108, FreqMultiplier: 9.2, Bandwidth: 6},
				{Amplitude: 0.0835, FreqMultiplier: 12, Bandwidth: 6},
				{Amplitude: 0.04175, FreqMultiplier: 24, Bandwidth: 6},
				{Amplitude: 0.021, FreqMultiplier: 48, Bandwidth: 6},
			],
		}],
		TableSize: 16384,
		Volume: 0.25,
	},
	Celesta: {
		Envelope: {
			Segments: [0.005, 0, 0.3],
			Volume: [0, 1, 1, 0],
			Exp: 5,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 8},
				{Amplitude: 0.25, FreqMultiplier: 4, Bandwidth: 9},
				{Amplitude: 0.108, FreqMultiplier: 9.2, Bandwidth: 6},
				{Amplitude: 0.0835, FreqMultiplier: 12, Bandwidth: 6},
				{Amplitude: 0.04175, FreqMultiplier: 24, Bandwidth: 6},
				{Amplitude: 0.021, FreqMultiplier: 48, Bandwidth: 6},
			],
		}],
		TableSize: 16384,
		Volume: 0.15,
	},
	Xylophone: {
		Envelope: {
			Segments: [0.006, 0.015, 0.2],
			Volume: [0, 1, 0.2, 0],
			Exp: 5,
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 20},
				{Amplitude: 0.333, FreqMultiplier: 3, Bandwidth: 60},
				{Amplitude: 0.108, FreqMultiplier: 9.2, Bandwidth: 184},
				{Amplitude: 0.0769, FreqMultiplier: 13, Bandwidth: 260},
				{Amplitude: 0.033, FreqMultiplier: 30, Bandwidth: 600},
			],
		}],
		TableSize: 16384,
		Volume: 0.25,
	},
	Fx4Atmosphere: {
		Envelope: {
			Segments: [0.015, 0.2, 0.2],
			Volume: [0, 1, 0.4, 0],
			Exp: 3,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "6+14*x",
					Amplitude: "pow(x, -2.4)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.5,
	},
	NewAge: {
		Envelope: {
			Segments: [0.015, 0.04, 0.3],
			Volume: [0, 1, 0.5, 0],
			Exp: 3,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 20},
				{Amplitude: 0.5, FreqMultiplier: 4, Bandwidth: 46},
				{Amplitude: 0.25, FreqMultiplier: 8, Bandwidth: 94},
				{Amplitude: 0.125, FreqMultiplier: 16, Bandwidth: 190},
				{Amplitude: 0.0625, FreqMultiplier: 32, Bandwidth: 380}
			],
		}],
		TableSize: 8192,
		Volume: 0.17,
	},
	Pad5Bowed: {
		Envelope: {
			Segments: [0.015, 0.04, 0.3],
			Volume: [0, 1, 0.5, 0],
			Exp: 3,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 20},
				{Amplitude: 0.5, FreqMultiplier: 4, Bandwidth: 46},
				{Amplitude: 0.25, FreqMultiplier: 8, Bandwidth: 94},
				{Amplitude: 0.125, FreqMultiplier: 16, Bandwidth: 190},
				{Amplitude: 0.0625, FreqMultiplier: 32, Bandwidth: 380}
			],
		}],
		TableSize: 8192,
		Volume: 0.17,
	},
	Glockenspiel: {
		Envelope: {
			Segments: [0.011, 0.08, 0.7],
			Volume: [0, 1, 0.6, 0],
			Exp: 8,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 0.33, FreqMultiplier: 1, Bandwidth: 7},
				{Amplitude: 0.19, FreqMultiplier: 6.7, Bandwidth: 30},
				{Amplitude: 0.15, FreqMultiplier: 6.1, Bandwidth: 40},
				{Amplitude: 0.12, FreqMultiplier: 8.4, Bandwidth: 17},
				{Amplitude: 0.15, FreqMultiplier: 12.7, Bandwidth: 37},
				{Amplitude: 0.12, FreqMultiplier: 23.2, Bandwidth: 28}
			],
		}],
		TableSize: 16384,
		Volume: 0.15,
	},


	Lead1Square: {
		Envelope: {
			Segments: [0.007, 0.01, 0.05],
			Volume: [0, 1, 0.62, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "1.7*x-0.7",
					Amplitude: "(x%2*2-1)*pow(x, -1.3)",
					FreqMultiplier: "2*x-1",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.1,
		//TODO: overdrive
	},
	Lead2Sawtooth: {
		Envelope: {
			Segments: [0.02, 0.01, 0.15],
			Volume: [0.0001, 1, 0.7, 0.000001],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "1.7*x",
					Amplitude: "((x%2)*2-1)/x",
				},
			],
		}],
		TableSize: 32768,
		Volume: 0.05,
		//TODO: overdrive
	},
	

	SynthBass1: {
		Envelope: {
			Segments: [0.01, 0.4],
			Volume: [0, 1, 0],
			Exp: 4,
			ExpExpK: 5,
			ExpExpBase: 0.00003,
			ExponentialInterpolation: true,
		},
		//SawtoothWaveForm: {},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "3+5*x",
					Amplitude: "cos(PI*(x/21-0.5))/(x*x)",
				},
			],
		}],
		Volume: 0.15,
		/*KarplusStrong: {
			SmoothFactor: "0.3*(0.9 - sqrt(log2(x / 16.352) * 12 / 128)*0.8 + rand * 0.1)"
		},*/
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 2, 3.5],
			Frequency: 7,
		},
	},
	Lead5Charang: {
		Envelope: {
			Segments: [0.01, 0, 0.05],
			Volume: [0, 1, 1, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 16,
					Bandwidth: "0.5*x",
					Amplitude: "cos(PI*(x/16-0.5))/x",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	FluteNew: {
		Envelope: {
			Segments: [0.02, 0.07, 0.23],
			Volume: [0, 1, 0.92, 0],
			//ExponentialInterpolation: true,
			CutoffFreq: [200, 20000, 20000, 100],
		},
		HarmonicSets: [
			{
				HarmonicsSeries: [
					{
						NumHarmonics: 64,
						Bandwidth: "3+5*x",
						Amplitude: "(0.8-0.1*rand*sqrt(x))*pow(x, -1.5)",
					},
					{
						NumHarmonics: 64,
						Bandwidth: 1200,
						Amplitude: "(0.025+0.05*rand)/sqrt(x)",
					}
				],
				Resonances: [
					{Frequency: 650, Width: 140, Amplitude: 350},
					{Frequency: 1400, Width: 80, Amplitude: 200},
				],
			}
		],
		TableSize: 32768,
		Volume: 0.3,
		Vibrato: {
			Segments: [0.5],
			Value: [3, 3],
			Frequency: 0.5,
		},
	},
	Flute: {
		Envelope: {
			Segments: [0.07, 0.07, 0.1],
			Volume: [0, 1, 0.92, 0],
			//ExponentialInterpolation: true,
			CutoffFreq: [200, 20000, 20000, 100],
		},
		HarmonicSets: [
			{
				HarmonicsSeries: [
					{
						NumHarmonics: 16,
						Bandwidth: "6*x-1",
						Amplitude: "pow(x, -2.5)",
						FreqMultiplier: "2*x-1",
					},
				],
			}
		],
		TableSize: 16384,
		Volume: 0.2,
		Vibrato: {
			Segments: [0.5],
			Value: [3, 3],
			Frequency: 0.5,
		},
	},
	Flute2: {
		Envelope: {
			Segments: [0.03, 0.07, 0.3],
			Volume: [0, 1, 0.92, 0],
			//CutoffFreq: [20000, 20000, 20000, 100],
		},
		HarmonicSets: [
			{
				HarmonicsSeries: [
					{
						NumHarmonics: 64,
						Bandwidth: "3+x",
						Amplitude: "(0.8-0.1*rand*sqrt(x))*pow(x, -1.5)",
					},
					{
						NumHarmonics: 64,
						Bandwidth: 1200,
						Amplitude: "(0.01+0.02*rand)",
					}
				],
				Resonances: [
					{Frequency: 650, Width: 140, Amplitude: 85},
					{Frequency: 1400, Width: 80, Amplitude: 50},
					//{Frequency: 1400, Width: 1000, Amplitude: 350},
				],
			},
			{
				HarmonicsSeries: [
					{
						NumHarmonics: 64,
						Bandwidth: 1200,
						Amplitude: "(0.02+0.01*rand)",
					}
				],
			}
		],
		TableSize: 32768,
		Volume: 0.1,
		Vibrato: {
			Segments: [0.5],
			Value: [3, 3],
			Frequency: 0.5,
		},
	},
	Recorder: {
		Envelope: {
			Segments: [0.007, 0.07, 0.01],
			Volume: [0, 1, 0.92, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "0.2*x-0.1",
					Amplitude: "cos(PI*(x/2.25-0.5))/pow(x, 2.3)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.25,
	},
	Clarinet: {
		Envelope: {
			Segments: [0.03, 0.05, 0.1],
			Volume: [0, 1, 0.75, 0],
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 15},
				{Amplitude: 0.275, FreqMultiplier: 3, Bandwidth: 45},
				{Amplitude: 0.2, FreqMultiplier: 5, Bandwidth: 55},
				{Amplitude: 0.1, FreqMultiplier: 7, Bandwidth: 105},
				{Amplitude: 0.05, FreqMultiplier: 9 , Bandwidth: 135},
				{Amplitude: 0.03, FreqMultiplier: 11, Bandwidth: 165},
				{Amplitude: 0.08, FreqMultiplier: 13, Bandwidth: 195}
			],
		}],
		TableSize: 16384,
		Vibrato: {
			Segments: [0.5],
			Value: [0, 15],
			Frequency: 0.5,
		},
		Volume: 0.35,
	},
	Fx2SoundTrack: {
		Envelope: {
			Segments: [0.7, 0.3, 0.6],
			Volume: [0, 1, 0.5, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				NumHarmonics: 100,
				Bandwidth: "40+40*x",
				Amplitude: "1/x",
			}],
			Resonances: [
				{Frequency: 500, Width: 140, Amplitude: 1},
				{Frequency: 900, Width: 540, Amplitude: 4},
				{Frequency: 2100, Width: 1400, Amplitude: 10},
				{Frequency: 3700, Width: 2100, Amplitude: 15},
				{Frequency: 4700, Width: 2800, Amplitude: 20},
			],
			IsResonanceMultiplicative: true,
		}],
		TableSize: 32768,
		Volume: 0.1,
	},
	ReverseCymbal: {
		Envelope: {
			Segments: [1, 0.1, 2],
			Volume: [0, 1, 1, 0],
			//ExpExpK: 7,
			//ExpExpBase: 0.00003,
			//CutoffFreq: [100, 20000, 1000, 100],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.2,
	},
	BassLead: {
		Envelope: {
			Segments: [0.01, 0.1, 0.3],
			Volume: [0, 1, 0.6, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "x",
					NumHarmonics: 16,
					Amplitude: "cos(PI*(x/6-0.5))/pow(x, 1.8)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	SynthBass2: {
		Envelope: {
			Segments: [0.01, 0.3, 0.1],
			Volume: [0, 1, 0.6, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "x",
					NumHarmonics: 16,
					Amplitude: "cos(PI*(x/6-0.5))/pow(x, 1.8)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	ElectricBassPick: {
		Envelope: {
			Segments: [0.008, 0.05, 0.03],
			Volume: [0, 1, 0.3, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "x",
					NumHarmonics: 16,
					Amplitude: "cos(PI*(x/6-0.5))/pow(x, 1.8)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.25,
	},
	SlapBass: {
		Envelope: {
			Segments: [0.006, 0.3, 0.1],
			Volume: [0, 1, 0.6, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "x",
					NumHarmonics: 16,
					Amplitude: "cos(PI*(x/6-0.5))/pow(x, 1.8)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.15,
	},
	
	Trumpet: {
		Envelope: {
			Segments: [0.02, 0.02, 0.1],
			Volume: [0, 1, 0.7, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: 1,
					NumHarmonics: 64,
					Amplitude: "0.8/(x*x)",
				},
				{
					Bandwidth: 1200,
					NumHarmonics: 64,
					Amplitude: "0.01+0.02*rand",
				}
			],
			Resonances: [
				{Frequency: 2500, Width: 1000, Amplitude: 500},
				{Frequency: 6500, Width: 1000, Amplitude: 100},
			],
		}],
		TableSize: 16384,
		Volume: 0.35,
	},
	TrumpetOld: {
		Envelope: {
			Segments: [0.02, 0.02, 0.1],
			Volume: [0, 1, 0.7, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "0.4*x",
					NumHarmonics: 20,
					Amplitude: "cos(PI*(x/9-0.5))/(x*x)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.35,
	},
	EnglishHorn: {
		Envelope: {
			Segments: [0.1, 0, 0.1],
			Volume: [0, 1, 1, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "0.4*x",
					NumHarmonics: 20,
					Amplitude: "cos(PI*(x/9-0.5))/(x*x)",
				},
			],
		}],
		Vibrato: {
			Segments: [0.5],
			Value: [0, 9],
			Frequency: 0.5,
		},
		TableSize: 16384,
		Volume: 0.35,
	},
	FrenchHorn: {
		Envelope: {
			Segments: [0.05, 0, 0.05],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "0.4*x",
					NumHarmonics: 20,
					Amplitude: "cos(PI*(x/9-0.5))/(x*x)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	Oboe: {
		Envelope: {
			Segments: [0.015, 0, 0.03],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					Bandwidth: "3.4+1.6*x",
					NumHarmonics: 16,
					Amplitude: "cos(PI*(x/1.6-0.5))/(x*x)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	Accordion: {
		Envelope: {
			Segments: [0.025, 0.02, 0.05],
			Volume: [0, 1, 0.7, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 24,
					Bandwidth: "12.2*x+2.8",
					Amplitude: "cos(PI*(x/6-0.5))/pow(x, 1.5)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.5,
	},
	Accordion1: {
		Envelope: {
			Segments: [0.025, 0.02, 0.05],
			Volume: [0, 1, 0.7, 0],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: 1,
					Amplitude: "(0.06+0.3*rand)*pow(x, -1.5)",
					FreqMultiplier: "1.007*x",
				},
				{
					NumHarmonics: 64,
					Bandwidth: "15+10*x",
					Amplitude: "(0.08+0.4*rand)/(x*x)",
					FreqMultiplier: "0.9955*x",
				}
			],
			Resonances: [
				{Frequency: 1700, Width: 400, Amplitude: 150},
				{Frequency: 4200, Width: 400, Amplitude: 100},
				{Frequency: 7300, Width: 700, Amplitude: 15},
				{Frequency: 11200, Width: 700, Amplitude: 10},
			],
		}],
		TableSize: 32768,
		Volume: 0.1,
	},
	Tuba: {
		Envelope: {
			Segments: [0.01, 0, 0.05],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 24,
					Bandwidth: 0.1,
					Amplitude: "cos(PI*(x/9-0.5))/(x*x)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	FretlessBass: {
		Envelope: {
			Segments: [0.01, 0, 0.1],
			Volume: [0, 1, 1, 0],
			Exp: 5,
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 24,
					Bandwidth: 0.1,
					Amplitude: "cos(PI*(x/16-0.5))/(x*x)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.2,
	},
	Sax: {
		Envelope: {
			Segments: [0.012, 0, 0.02],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 64,
					Bandwidth: "0.5*x",
					Amplitude: "cos(PI*(x/9-0.5))*pow(x, -2.4) + 0.5*((x+1)%2)*cos(PI*(x/2/9-0.5))*pow(x/2, -2.5)",
				},
			],
		}],
		TableSize: 16384,
		Volume: 0.3,
	},
	SynthOrgan: {
		Envelope: {
			Segments: [0.01, 0, 0.01],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			HarmonicsSeries: [
				{
					NumHarmonics: 20,
					Bandwidth: "10*(1+pow(x, 1.25))",
					Amplitude: "1/x",
					FreqMultiplier: "pow(2, x-2)",
				},
			],
		}],
		TableSize: 32768,
		Volume: 0.1,
	},
	Whistle: {
		Envelope: {
			Segments: [0.01, 0, 0.01],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			Harmonics: [
				{Bandwidth: 5, Amplitude: 1, FreqMultiplier: 1},
				{Bandwidth: 1000, Amplitude: 0.2, FreqMultiplier: 1},
				{Bandwidth: 10, Amplitude: 0.02, FreqMultiplier: 2},
				{Bandwidth: 1000, Amplitude: 0.1, FreqMultiplier: 2},
				{Bandwidth: 15, Amplitude: 0.01, FreqMultiplier: 3},
				{Bandwidth: 1000, Amplitude: 0.05, FreqMultiplier: 3},
			],
		}],
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 3, 5],
			Frequency: 5,
		},
		TableSize: 16384,
		Volume: 0.15,
	},
	Ocarina: {
		Envelope: {
			Segments: [0.003, 0, 0.1],
			Volume: [0, 1, 1, 0],
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 3},
				{Amplitude: 0.01, FreqMultiplier: 2, Bandwidth: 7},
				{Amplitude: 0.1, FreqMultiplier: 3, Bandwidth: 7},
				{Amplitude: 0.03, FreqMultiplier: 4, Bandwidth: 7},
			],
		}],
		Vibrato: {
			Segments: [0.3, 0.5],
			Value: [0, 3, 9],
			Frequency: 5,
		},
		TableSize: 16384,
		Volume: 0.3,
	},
	Applause: {
		Envelope: {
			Segments: [0.7, 0.5, 0.5],
			Volume: [1, 1, 1, 1],
			//ExpExpK: 7,
			//ExpExpBase: 0.00003,
			CutoffFreq: [500, 5000, 5000, 500],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.05,
	},
	Helicopter: {
		Envelope: {
			Segments: [0.7, 0.5, 0.5],
			Volume: [1, 1, 1, 1],
			//ExpExpK: 7,
			//ExpExpBase: 0.00003,
			CutoffFreq: [500, 2000, 2000, 500],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.5,
		//TODO: tremolo
	},
	Seashore: {
		Envelope: {
			Segments: [0.7, 0.5, 0.5],
			Volume: [1, 1, 1, 1],
			//ExpExpK: 7,
			//ExpExpBase: 0.00003,
			//CutoffFreq: [500, 2000, 2000, 500],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.04,
		//TODO: pink noise
	},
	PhoneRing: {
		Envelope: {
			Segments: [0.7, 0.5, 0.5],
			Volume: [1, 1, 1, 1],
			//ExpExpK: 7,
			//ExpExpBase: 0.00003,
			//CutoffFreq: [500, 2000, 2000, 500],
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			Harmonics: [
				{Bandwidth: 3, Amplitude: 1, FreqMultiplier: 1},
			],
		}],
		TableSize: 16384,
		//TremoloValue: 0.03, //TODO
		//TremoloFrequency: 5,
		Volume: 0.5,
	},
	Gunshot: {
		Envelope: {
			Segments: [0.1, 0.5, 4],
			Volume: [1, 1, 1, 1],
			ExpExpK: 7,
			ExpExpBase: 0.00003,
			//CutoffFreq: [100, 20000, 1000, 100],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.4,
	},
	Timpani: { //TODO
		Envelope: {
			Segments: [0.1, 0.5, 4],
			Volume: [1, 1, 1, 1],
			ExpExpK: 15,
			ExpExpBase: 0.00005,
			//CutoffFreq: [100, 20000, 1000, 100],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.2,
	},
	NoiseTest: {
		Envelope: {
			Segments: [0.5, 0.5, 4],
			Volume: [1, 1, 1, 1],
			//ExpExpK: 7,
			//ExpExpBase: 0.00003,
			CutoffFreq: [100, 20000, 1000, 100],
			ExponentialInterpolation: true,
		},
		NoiseWaveform: {},
		TableSize: 32768,
		Volume: 0.2,
	},
	Kalimba: {
		Envelope: {
			Segments: [0.004, 0.05, 0.1],
			Volume: [0, 1, 0.3, 0],
			Exp: 5,
		},
		HarmonicSets: [{
			Harmonics: [
				{Amplitude: 1, FreqMultiplier: 1, Bandwidth: 20},
				{Amplitude: 0.5, FreqMultiplier: 4, Bandwidth: 46},
				{Amplitude: 0.25, FreqMultiplier: 8, Bandwidth: 94},
				{Amplitude: 0.125, FreqMultiplier: 16, Bandwidth: 190},
				{Amplitude: 0.0625, FreqMultiplier: 32, Bandwidth: 380}
			],
		}],
		TableSize: 32768,
		Volume: 0.2,
	},
	OverdrivenGuitar: { //TODO: not finished
		Envelope: {
			Segments: [0.005, 0.7],
			Volume: [0, 1, 0],
			ExpExpK: 5,
			ExpExpBase: 0.00003,
			ExponentialInterpolation: true,
		},
		HarmonicSets: [{
			HarmonicsSeries: [{
				Amplitude: "abs((43*x*x + 37*x) % 397 / 200 - 1)/x",
			}],
		}],
		TableSize: 16384,
		Volume: 0.1,
		//TODO: overdrive effect
	},
};

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
