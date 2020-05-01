# xdepend [![Build Status](https://travis-ci.com/mszkb/xdepend.svg?branch=master)](https://travis-ci.com/mszkb/xdepend)

> xdepend extracts the dependencies of a package.json file into an install string
> It has some neat features like upgrading version of packages or creating
> a report about various details of each package. Details are: Licenses, last Commit,
> last Publish and issues

## Development

To get started with development you only have to do npm install

```
$ npm install
```

If you use an IDE like Webstorm or PhpStorm checkout [XO in WebStorm](https://github.com/jamestalmage/xo-with-webstorm)
to enable eslint reformating in conjunction with XO.

Tests are done with [ava](https://github.com/avajs/ava). Unfortunately there is no WebStorm/PhpStorm for it, you can
go with a workaround plugin in the IDEA marketplace.

````
$ npm run test
````

## Roadmap

- Publish on npm
- Markdown report
- Interactive Mode
- Upgrade string of packages
