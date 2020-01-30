# npmbomb
[![Build Status](https://dev.azure.com/tmkndev/npmbomb/_apis/build/status/tmkn.npmbomb?branchName=master)](https://dev.azure.com/tmkndev/npmbomb/_build/latest?definitionId=2&branchName=master)
[![codecov](https://codecov.io/gh/tmkn/npmbomb/branch/master/graph/badge.svg)](https://codecov.io/gh/tmkn/npmbomb)
[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/tmkn/npmbomb)
![npmbomb screenshot](npmbomb.png)
Guess the dependency count for popular NPM packages
https://npmbomb.tmkn.dev

You can either take a tour and guess the number for 4 random dependencies or go to a specific dependency directly.


## Tech Stack
At its technical core, npmbomb is a single page application written in TypeScript utilizing React as its main UI library. In the source code you'll find that all React components are `Function Components`, this is by design. While there is nothing wrong with Class Components, a design goal for this application was to build it solely with Function Components utilizing Reacts Hook and Context functionality for its state management.

Additionally React Router is used to provide client side routing capabilities.

Styling is done via Emotion.
The app defines 3 breakpoints, a mobile layout, a desktop version and layout inbetween.

## Development
This project uses Yarn 1.

### Local Setup
`yarn install`
### Start development server
`yarn start`

## Tests
Unit tests are done via jest and react testing library.

E2E tests are done with cypress.
### Run unit tests
`yarn test`
### Generate code coverage
`yarn test:coverage`
### Run E2E tests
Start development server with `yarn start`, then do

`yarn cypress:run`
### Visual regression testing
Percy is used to do visual regression testing.
It is done automatically on every pull request/merge into master.

### CI
Every pull request/master commit automatically triggers the CI pipeline.
There, the application will be built and tested on Windows, Linux and Mac. While a web app and thus independent of the underlying os, it is done to ensure that the development environment continues to work cross platform.

The pipeline also creates and uploads the calculated code coverage. [![codecov](https://codecov.io/gh/tmkn/npmbomb/branch/master/graph/badge.svg)](https://codecov.io/gh/tmkn/npmbomb)

It is also responsible for executing the visual regression tests. [![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/tmkn/npmbomb)

Lastly it deploys the web application to netlify.

### Roadmap
In no particular order.
* ~~Increase code coverage to >90%~~
* Visualize dependency tree
* Use React concurrent mode to load data
* Explore hosting options for the data set
* A11Y