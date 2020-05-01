#!/usr/bin/env node
'use strict';
const meow = require('meow');
const xdepend = require('.');

const cli = meow(`
	Usage
	  $ xdepend [input]

	Options
	  -f, --force Force upgraded dependencies (only if you know breaking changes)
	  -o, --output <filename>
	  -i, --interactive Interactive Mode, we ask you which version you'd like to have
	  -r, --report creates a nice report

	Examples
	  $ xdepend
	  unicorns & rainbows
	  $ xdepend ponies
	  ponies & rainbows
`, {
	flags: {
		force: {
			type: 'boolean',
			alias: 'f'
		},
		output: {
			type: 'string',
			alias: 'o'
		},
		interactive: {
			type: 'boolean',
			alias: 'i'
		},
		report: {
			type: 'boolean',
			alias: 'r'
		}
	}
});

xdepend(cli.flags).then(cliOutput => {
	if (cliOutput) {
		console.log(cliOutput);
	} else {
		console.log(':) No output');
	}
});
