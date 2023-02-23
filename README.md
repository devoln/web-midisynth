# Web MIDI synthesizer

### Demo

Try it [here](https://devoln.github.io/web-midisynth/): play any MIDI file you have or play on your keyboard. You can also use a MIDI-keyboard If your browser supports Web MIDI.

[Here](https://codepen.io/devoln/pen/jOqXOBR) you can listen to the examples and see how to embed the MIDI player on your page.

### How it works

Everything is generated purely by algorithms written in JavaScript. There are no samples or recordings involved. This is why the synthesizer is so lightweight. If you compress all the synthesizer JS files used by `embed.html` you will get about 25-30 KB in size.

The algorithms used by the synthesizer:

1. **Karplus-Strong** string model for guitars and pianos
2. **PADsynth** for most other instruments
3. **Physical modelling**: for drums (planned)

### Code organization

The code is run by browser as is, so it doesn't require any build systems.

The engine is defined in `utils.js`. It is not easy to understand and currently needs refactoring.

All the instruments are defined and mapped to General MIDI IDs in `instruments.js` in a declarative data-driven way. I tried to make it as readable as possible, so that modifying it should be the easiest way for you to contribute to the project.

If you manage to make an existing instrument sound better or add a new good instrument, make a pull request. I will highly appreciate your contribution!



### Usage terms

This is a prototype, don't expect any stability from it. Currently it lacks API, decent GUI, many instruments, etc. Embedded player is probably going to change.

Use it for fun or educational purposes however you want. If you want to use it in a commercial project, please contact me.

