import test from "ava";
import {generateInstallDevString, generateInstallString, parsePackageJson} from "./lib/packageJsonParser";
import * as xutils from "./lib/utils";
const path = require('path');
const fs = require('fs');
import execa from "execa";

test('test cli default', () => {

});

test('test cli force mode', () => {
	// TODO test if we have latest versions

});

test('test cli output file', async (t) => {
	t.timeout(30000);

	await execa('./cli.js', ['-o output.test.txt']);
	const fileContent = await xutils.readFile(path.join(process.cwd(), "output.test.txt"));
	const result1 = fileContent.split("\n")[5];
	const result2 = fileContent.split("\n")[6];
	t.is(result1, "npm i --save-dev firstline@^2.0.2 meow@^6.1.0");
	t.is(result2, "npm i --save-dev @ava/babel@^1.0.1 ava@^3.8.1 execa@^4.0.0 nyc@^15.0.1 xo@^0.30.0");
});

test('test cli interactive mode', () => {
	// TODO test stdouts
});

test('test cli replace mode', () => {
	// TODO test for backup file

	// TODO test if package.json dependencies and devdependencies are the latest
});

test('read package.json file from current path', async (t) => {
	const currentPath = process.cwd();
	const fullPath = path.join(currentPath, 'package.test.json');
	const dependencies = await parsePackageJson(fullPath);
	t.is(dependencies.meow, "^6.1.1");
});

test('generate install string from package.json', async (t) => {
	t.timeout(30000);

	const currentPath = process.cwd();
	const fullPath = path.join(currentPath, 'package.test.json');

	const obj = await parsePackageJson(fullPath);
	const dependencies = obj.dependencies;
	const devdependencies = obj.devDependencies;

	const installDevString = generateInstallDevString(devdependencies);
	t.is(installDevString, "npm i --save-dev @ava/babel@^1.0.1 ava@^3.8.1 nyc@^15.0.1 xo@^0.30.0");

	const installString = generateInstallString(dependencies);
	t.is(installString, "npm i --save meow@^6.1.0");
});
