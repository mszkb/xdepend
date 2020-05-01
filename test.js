import test from 'ava';
import {generateInstallDevString, generateInstallString, parsePackageJson} from './lib/package-json-parser';
import * as xutils from './lib/utils';
import * as xreport from './lib/xreport';
const path = require('path');
import execa from 'execa';
const NpmApi = require('npm-api');
const fetch = require('node-fetch');

const currentPath = process.cwd();
const fullPath = path.join(currentPath, 'package.test.json');
const defaultOutput = 'output.test.txt';

test.afterEach.always(async t => {
	try {
		await xutils.removeOldFile(defaultOutput);
	} catch (error) {
		t.is(error.code, 'ENOENT');
	}
});

test.serial('xdepend test file operations', async t => {
	const newFile = await xutils.writeFile(defaultOutput, 'BLA');
	t.is(newFile, true);

	const appended = await xutils.appendFile(defaultOutput, 'BLA2');
	t.is(appended, true);

	const fileContent = (await xutils.readFile(defaultOutput)).split('\n');
	const row1 = fileContent[5];
	const row2 = fileContent[6];
	t.is(row1, 'BLA');
	t.is(row2, 'BLA2');
});

test.serial('xdepend test unsecure file detection', async t => {
	const error = await t.throwsAsync(xutils.checkFileSecure(fullPath));
	t.is(error.message, 'Check the filepath we probably overwrite an existing file !!!');
});

test.serial('test cli output file', async t => {
	await execa('./cli.js', ['-o output.test.txt']);
	const fileContent = await xutils.readFile(path.join(process.cwd(), defaultOutput));
	const result1 = fileContent.split('\n')[5];
	const result2 = fileContent.split('\n')[6];
	t.is(result1, 'npm i --save-dev firstline@^2.0.2 meow@^6.1.0');
	t.is(result2, 'npm i --save-dev @ava/babel@^1.0.1 ava@^3.8.1 execa@^4.0.0 nyc@^15.0.1 xo@^0.30.0');
});

test.serial('test cli report mode', async t => {
	t.timeout(30000);
	await execa('./cli.js', ['-r']);
});

test('read package.json file from current path', async t => {
	const {dependencies} = await parsePackageJson(fullPath);
	t.is(dependencies.meow, '^6.1.0');
});

test('generate install string from package.json', async t => {
	const object = await parsePackageJson(fullPath);
	const {dependencies} = object;
	const devdependencies = object.devDependencies;

	const installDevString = generateInstallDevString(devdependencies);
	t.is(installDevString, 'npm i --save-dev @ava/babel@^1.0.1 ava@^3.8.1 nyc@^15.0.1 xo@^0.30.0');

	const installString = generateInstallString(dependencies);
	t.is(installString, 'npm i --save meow@^6.1.0');
});

test('generate report from package.json with one dev dependency', async t => {
	const devdependencies = {
		ava: '^3.8.1'
	};
	const table = '| Packages | LICENSE | Version | Latest Tags | Last Commit | Issues |\n|----------|---------|---------|-------------|-------------|--------|\n';
	const dependency = '| ava | MIT | ^3.8.1 | 3.8.1 | 4/27/2020 | 0 |\n';
	const report = await xreport.generateReport([], devdependencies);
	console.log(report);
	t.is(report, `${table}${dependency}`);
});

test('test fetchNpmDat single', async t => {
	const ava = await xreport.fetchNpmData('ava');

	const repo = new NpmApi().repo('ava');
	const latestVersion = (await repo.package()).version;

	t.deepEqual(ava, {
		dependencyName: 'ava',
		latestVersion,
		license: 'MIT',
		lastPublish: '4/27/2020'
	});
});

// eslint-disable-next-line ava/prefer-async-await
test('test npm registry fetch', t => {
	const npmRegistryUrl = 'https://registry.npmjs.org/';
	const packagePath = 'ava';
	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
		}
	};

	return fetch(`${npmRegistryUrl}${packagePath}`, options)
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(result => result.json())
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(json => {
			console.log(json);
			const modified = new Date(json.modified);
			t.is(modified.toLocaleDateString(), '4/27/2020');
		});
});
