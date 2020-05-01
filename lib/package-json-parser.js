const {readFile} = require('./utils');

function generateInstallString(dependenciesObject) {
	const installCommand = 'npm i --save';
	const dep = xtractDep(dependenciesObject);
	return `${installCommand} ${dep}`;
}

function generateInstallDevString(devdependenciesObject) {
	const installDevCommand = 'npm i --save-dev';
	const dep = xtractDep(devdependenciesObject);
	return `${installDevCommand} ${dep}`;
}

function xtractDep(dependencyObject) {
	return Object.keys(dependencyObject).map(key => {
		return `${key}@${dependencyObject[key]}`;
	}).join(' ');
}

async function parsePackageJson(path) {
	const allDependencies = await loadPackageJson(path);
	const {dependencies} = allDependencies;
	const {devDependencies} = allDependencies;

	return {
		dependencies,
		devDependencies
	};
}

async function loadPackageJson(path) {
	try {
		const fileContent = await readFile(path);
		return JSON.parse(fileContent);
	} catch (error) {
		return new Error(error);
	}
}

module.exports = {
	parsePackageJson,
	generateInstallString,
	generateInstallDevString
};
