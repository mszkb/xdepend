'use strict';

const { parsePackageJson, generateInstallDevString } = require('./lib/packageJsonParser')  ;
const { writeFile, removeOldFile, appendFile } = require('./lib/utils');

const path = require('path');
const fs = require('fs');
const currentPath = process.cwd();

async function entry(input, {postfix = 'rainbows'} = {}) {
	let forceMode = input.f === true;
	let outputFile = input.output || false;
	let interactiveMode = input.i === true;

	const fullPath = path.join(currentPath, 'package.json');

	const installs = await parsePackageJson(fullPath);
	const dependencies = generateInstallDevString(installs.dependencies);
	const devDependencies = generateInstallDevString(installs.devDependencies);

	if(outputFile) {
		const trimmedFilePath = outputFile.trim();
		// await removeOldFile(trimmedFilePath);
		await writeFile(trimmedFilePath, dependencies)
		await appendFile(trimmedFilePath, devDependencies)
	}

	return `${input} & ${postfix}`;
}

module.exports = entry;
