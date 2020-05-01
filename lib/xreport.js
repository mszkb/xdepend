const NpmApi = require('npm-api');
const fetch = require('node-fetch');

// eslint-disable-next-line no-unused-vars
async function generateReport(dependency = [], devDependency = []) {
	const tableHeader = '| Packages | LICENSE | Version | Latest Tags | Last Commit | Issues |\n';
	const tableHeader2 = '|----------|---------|---------|-------------|-------------|--------|\n';

	const npmapi = new NpmApi();
	const npmRequest = Object.keys(devDependency).map(key => {
		return fetchNpmData(key, npmapi);
	});

	const npmData = await Promise.all(npmRequest);
	const npmDataTable = npmData.map(element => {
		return `| ${element.dependencyName} | ${element.license} | ${devDependency[element.dependencyName]} | ${element.latestVersion} | ${element.lastPublish} | 0 |\n`;
	}).join('\n');

	return `${tableHeader}${tableHeader2}${npmDataTable}`;
}

async function fetchNpmData(dependencyName, npmApiInstance = undefined) {
	let npm = npmApiInstance;
	if (npm === undefined) {
		npm = new NpmApi();
	}

	const repo = npm.repo(dependencyName);
	let latestVersion;
	let license;
	let lastPublish;

	const promises = [];

	try {
		promises.push(repo.package()); // Per default we query after the latest version
		promises.push(getLastPublishDate(dependencyName));

		const results = await Promise.all(promises);
		latestVersion = results[0].version;
		license = results[0].license || 'NO LICENSE';
		lastPublish = results[1];
	} catch (error) {
		console.error(error);
	}

	return {
		dependencyName,
		latestVersion,
		license,
		lastPublish
	};
}

/**
 * Yeah you have to make a seperate query to get the last publish date, sadly
 * it is not in the package.json
 *
 * @param dependencyName
 * @returns {Promise<void>}
 */
async function getLastPublishDate(dependencyName) {
	const npmRegistryUrl = 'https://registry.npmjs.org/';
	const packagePath = dependencyName;
	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
		}
	};

	return fetch(`${npmRegistryUrl}${packagePath}`, options)
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(npmRegistryResult => npmRegistryResult.json())
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(json => {
			const modified = new Date(json.modified);
			return modified.toLocaleDateString();
		});
}

module.exports = {generateReport, fetchNpmData};
