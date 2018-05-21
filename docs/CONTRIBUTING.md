# Contributing to ABE

:+1::tada: First off, thanks for taking the time to contribute to ABE! :tada::+1:

## Help Needed

Please check out the [the open issues][issues].

## Project setup

#### Clone This Repo

You first need to clone the code from this repository to your computer. To do that, run the following:

```shell
git clone https://github.com/olin-build/abe-web.git
cd abe-web
```

#### Install Node.js and yarn

Then you'll need to install the Node.js server and a package manager (yarn).

Install nodejs [from
here](http://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/),
and yarn [here](https://yarnpkg.com/en/).

On macOS running [Homebrew](https://brew.sh/), you can install both nodejs and
yarn via `brew install yarn`.

On Ubuntu:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    nvm install node
    nvm use node
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get install yarn

#### Install Package Dependencies

Once you have Node installed, you can use `yarn` to install the necessary packages (read from `package.json`).

`cd` into the `abe-web` directory that the `git clone` command, above, created,
and run `yarn install`:

```shell
cd abe-web
yarn install
```

#### (Optional) Configure Environment variables

Certain environment variables may be set before running the server. In
particular, set `ABE_URL` to the URL of an [ABE server](https://github.com/olin-build/ABE).

* `ABE_URL` (optional) - the URL of the ABE back-end instance you'd like to
   connect to. (Please use a dev instance when developing.) This defaults to
   <http://localhost:3000/>, which is the URL of a local ABE server instance.
* `DEBUG` (optional) - set to `true` to use the [Redux
  devtools](https://github.com/zalmoxisus/redux-devtools-extension)
* `GA_ID` (optional) - set to your Google Analytics tracking ID

Set these variables by setting environment variables, or by creating a text file
called `.env` in the root of the repository.

If you are a member of Hacking the Library, use [this starter `.env`
file](https://docs.google.com/document/d/1CZ45xYT33sTi5xpFJF8BkEeniCRszaxcfwiBmvMdmbk/edit).

Otherwise, create your own `.env` file. You may copy `.env.template` to `.env`
and the values in that file.

### Run

To launch the web app, make sure you have a local ABE instance running on port
3000 (go to <https://github.com/olin-build/ABE> for instructions on how to run
ABE) and run the following:

    yarn dev

Then visit <http://localhost:8080/> in your browser.

Changes should be reflected in your browser every time you save a file (except
CSS files, which currently require a manual refresh), but it may take a couple
seconds for Webpack to recompile everything.

### Test

`yarn test` runs [Jest](https://facebook.github.io/jest/).

`yarn test:watch` runs Jest in watch mode.

`yarn test:coverage` creates a test coverage report. View the HTML at `./coverage/lcov-report/index.html`.

### Lint

`yarn lint` runs [ESLint](https://eslint.org/). This verifies that the code
matches the project style conventions — mostly the [Airbnb JavaScript style
guide](https://github.com/airbnb/javascript), with [some
exceptions](./eslintrc.yml).

`yarn format` fixes some lint errors, such as indentation and spacing.

### Built With

A familiarity with some of these technologies is helpful for working on the project,
although by no means do you need to know all of them to work on just some parts.

General web development:

* [React](https://facebook.github.io/react/) lets JavaScript code create and
  update HTML presentation elements.
* [Redux](https://redux.js.org/) enables a [reactive programming
  style](https://en.wikipedia.org/wiki/Reactive_programming).
* [Babel](https://babeljs.io/) enables modern JavaScript features on older
  browsers.
* The [Ionic Framework](https://ionicframework.com/docs/) is a software
  development kit for mobile web views (and native apps). Thie project uses CSS
  files from the framework.

For working on the server or the build system:

* [Node.js](https://nodejs.org/en/https://nodejs.org/en/) runs JavaScript on the
  server.
* [Webpack](https://webpack.js.org/) combines and optimizes source files.

[issues]: https://github.com/olin-build/abe-web/issues
