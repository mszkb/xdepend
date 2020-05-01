const {readFile} = require("./utils");

function generateInstallString(dependenciesObject) {
	const installCommand = `npm i --save`;
	const dep = xtractDep(dependenciesObject);
	return `${installCommand} ${dep}`;
}

function generateInstallDevString(devdependenciesObject) {
	const installDevCommand = `npm i --save-dev`;
	const dep = xtractDep(devdependenciesObject);
	return `${installDevCommand} ${dep}`;
}

function xtractDep(dependencyObj) {
	return Object.keys(dependencyObj).map((key) => {
		return `${key}@${dependencyObj[key]}`;
	}).join(" ");
}

async function parsePackageJson(path) {
	const allDependencies = await loadPackageJson(path);
	const dependencies = allDependencies.dependencies;
	const devDependencies = allDependencies.devDependencies;

	return {
		dependencies,
		devDependencies
	};
}

async function loadPackageJson(path) {
	try {
		const fileContent = await readFile(path);
		return JSON.parse(fileContent);
	} catch (err) {
		return new Error(err);
	}
}

module.exports = {
	parsePackageJson,
	generateInstallString,
	generateInstallDevString
};
