const NpmApi = require("npm-api");

async function generateReport(dependency = [], devDependency = []) {
	const tableHeader = `| Packages | LICENSE | Version | Latest Tags | Last Commit | Issues |\n`;
	const tableHeader2=	`|----------|---------|---------|-------------|-------------|--------|\n`;

	let content = "";
	let npmRequest = [];
	Object.keys(devDependency).map((key) => {
		// TODO make fetch for each dependency to npm and get latest infos
		content +=
		`| ${key} | MIT | ${devDependency[key]} | | | |\n`
	});

	await Promise.all(npmRequest);

	return `${tableHeader}${tableHeader2}${content}`;
}

async function fetchNpmData(dependencyName, npmApiInstance = undefined) {
	let npm = npmApiInstance;
	if(npm === undefined) {
		npm = new NpmApi();
	}

	const repo = npm.repo(dependencyName);
	let package;
	let latestVersion;
	let license;

	try {
		package = await repo.package();  // per default we grab the latest version
		latestVersion = package.version;
		license = package.license || "NO LICENSE";
		console.log(latestVersion);
	} catch (e) {
		console.error(latestVersion);
	}

	return {
		dependencyName,
		latestVersion,
		license
	};
}

module.exports = { generateReport, fetchNpmData };
