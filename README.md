# A Web Front-End for ABE
This is a Web front-end for the
[Olin College of Engineering Library](http://www.olin.build')'s
[Amorphous Blob of Events](https://github.com/olinlibrary/ABE).

## Setup on Ubuntu

In order to run ABE's Web frontend, you'll need [Node.js](https://nodejs.org/en/https://nodejs.org/en/),
[React](https://facebook.github.io/react/), [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/).
You can install them by following the instructions below.

#### Clone This Repo

You first need to clone the code from this repository to your computer. To do that, run the following:

    git clone https://github.com/olinlibrary/abe-web-frontend.git
    cd abe-web-frontend

#### Node.js

Then you'll need to install the Node.js server and its package manager (npm).

    sudo apt-get update
    sudo apt-get install nodejs npm
    sudo npm install -g n
    sudo n latest

#### React, Babel and Webpack

Once you have Node installed, you can use `npm` to install the necessary packages.

    sudo npm install -g n
    sudo n latest
    npm install --save react react-dom react-router-dom babel-core babel-loader babel-preset-es2015 babel-preset-react webpack

#### Build and Run

To launch the Web app, run the following:

    ./node_modules/.bin/webpack -d --watch

And in another Terminal:

    npm run start

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

Changes should be reflected in your browser every time you save `app.jsx`,
but it may take a couple seconds for Webpack to recompile everything.
