# A Web Frontend for ABE

This is a Web front-end for the
[Olin College of Engineering Library](http://www.olin.build)'s
[Amorphous Blob of Events](https://github.com/olinlibrary/ABE).

## Setup on Ubuntu

In order to run ABE's Web frontend, you'll need [Node.js](https://nodejs.org/en/https://nodejs.org/en/),
[React](https://facebook.github.io/react/), [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/).
You can install them by following the instructions below.

### Clone This Repo

You first need to clone the code from this repository to your computer. To do that, run the following:

    git clone https://github.com/olinlibrary/abe-web.git
    cd abe-web

### Node.js

Then you'll need to install the Node.js server and a package manager (yarn).

Install nodejs [from here](http://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/), and yarn
[here](https://yarnpkg.com/en/).

On macOS running [Homebrew](https://brew.sh/), you can install both nodejs and
yarn via `brew install yarn`.

On Ubuntu:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    nvm install node
    nvm use node
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get install yarn

### Dependencies

Once you have Node installed, you can use `yarn` to install the necessary packages (read from `package.json`).

cd into the abe-web directory first, then run yarn install

    cd abe-web
    yarn install

### Environment variables

If you are a member of Hacking the Library, use [this starter .env file](https://docs.google.com/document/d/1CZ45xYT33sTi5xpFJF8BkEeniCRszaxcfwiBmvMdmbk/edit).
Otherwise, make your own. Its contents should be in the following format:

Certain environment variables need to be set before running the server:

* ABE_URL (required) - to the URL of the ABE backend instance you'd like to connect to (please use a dev instance when developing)
* DEBUG (optional) - set to `true` if you'd like to use the Redux devtools
* GA_ID (optional) - set to your Google Analytics tracking ID

This can be done through Node environment variables, or by creating a text file
called `.env` in the root of the repository.

To run against a local instance of ABE that is running on port, copy
`.env.template` to `.env`.

## Build and Run

To launch the web app, make sure you have a local ABE instance running
on port 3000 (go to https://github.com/olinlibrary/ABE for instructions on how to run ABE) and run the following:

    yarn dev

Then visit <http://localhost:8080/> in your browser.

Changes should be reflected in your browser every time you save a file (except CSS files, which currently require a manual refresh),
but it may take a couple seconds for Webpack to recompile everything.

## Test

`yarn test` runs [Jest](https://facebook.github.io/jest/).

`yarn test:watch` runs Jest in watch mode.

You can also run `jest` and `jest --watch`, if `./node_modules/.bin` is on your
`PATH`.

## Supporters

<a target="_blank" href="http://browserstack.com/" alt="BrowserStack"><img align="right" src="https://bstacksupport.zendesk.com/attachments/token/GVENo6DR01sT3B5jsNRfU0II7/?name=Logo-01.svg" width="40%"></a>We'd like to extend a special thank you to [BrowserStack](http://browserstack.com/) for providing us with their testing service free of charge. BrowserStack allows us to test our project in a multitude of browsers on various platforms, including IE, Safari, Android and iOS, to ensure compatibility with as many as possible.
