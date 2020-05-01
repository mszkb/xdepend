'use strict';

const {parsePackageJson, generateInstallString, generateInstallDevString} = require('./lib/package-json-parser');
const {writeFile, appendFile} = require('./lib/utils');

const path = require('path');
const currentPath = process.cwd();

async function entry(input) {
	const forceMode = input.f === true;
	const outputFile = input.output || false;
	const interactiveMode = input.i === true;
	const reportMode = input.report === true;

	const fullPath = path.join(currentPath, 'package.json');

	const installs = await parsePackageJson(fullPath);
	const dependencies = generateInstallString(installs.dependencies);
	const devDependencies = generateInstallDevString(installs.devDependencies);

	if (forceMode) {
		return ':) Force mode not implemented yet';
	}

	if (outputFile) {
		const trimmedFilePath = outputFile.trim();
		// Await removeOldFile(trimmedFilePath);
		await writeFile(trimmedFilePath, dependencies);
		await appendFile(trimmedFilePath, devDependencies);

		return `:) You can find your strings inside '${outputFile}'`;
	}

	if (interactiveMode) {
		return ':) Interactive mode not implemented yet';
	}

	if (reportMode) {
		return ':) Report mode not implemented yet';
	}

	return `${dependencies}\n${devDependencies}`;
}

module.exports = entry;
