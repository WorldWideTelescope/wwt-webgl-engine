[![Build Status](https://dev.azure.com/aasworldwidetelescope/WWT/_apis/build/status/WorldWideTelescope.wwt-webgl-engine?branchName=cranko)](https://dev.azure.com/aasworldwidetelescope/WWT/_build/latest?definitionId=21&branchName=cranko)
[![npm](https://img.shields.io/npm/v/@wwtelescope/astro?label=@wwtelescope/astro)](https://www.npmjs.com/package/@wwtelescope/astro)
[![npm](https://img.shields.io/npm/v/@wwtelescope/embed?label=@wwtelescope/embed)](https://www.npmjs.com/package/@wwtelescope/embed)
[![npm](https://img.shields.io/npm/v/@wwtelescope/embed-common?label=@wwtelescope/embed-common)](https://www.npmjs.com/package/@wwtelescope/embed-common)
[![npm](https://img.shields.io/npm/v/@wwtelescope/embed-creator?label=@wwtelescope/embed-creator)](https://www.npmjs.com/package/@wwtelescope/embed-creator)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine?label=@wwtelescope/engine)](https://www.npmjs.com/package/@wwtelescope/engine)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine-helpers?label=@wwtelescope/engine-helpers)](https://www.npmjs.com/package/@wwtelescope/engine-helpers)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine-types?label=@wwtelescope/engine-types)](https://www.npmjs.com/package/@wwtelescope/engine-types)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine-pinia?label=@wwtelescope/engine-pinia)](https://www.npmjs.com/package/@wwtelescope/engine-pinia)
[![npm](https://img.shields.io/npm/v/@wwtelescope/research-app?label=@wwtelescope/research-app)](https://www.npmjs.com/package/@wwtelescope/research-app)
[![npm](https://img.shields.io/npm/v/@wwtelescope/research-app-messages?label=@wwtelescope/research-app-messages)](https://www.npmjs.com/package/@wwtelescope/research-app-messages)
[![Powered by NumFOCUS](https://img.shields.io/badge/powered%20by-NumFOCUS-orange.svg?style=flat&colorA=E1523D&colorB=007D8A)](http://numfocus.org)

# The AAS WorldWide Telescope WebGL engine

The “WebGL engine” of the [AAS] [WorldWide Telescope][wwt-home] (WWT) is a
JavaScript/[TypeScript] framework that powers the Web-based versions of the WWT
visualization software, as exemplified by the [WWT web client][webclient].

Learn more about WWT [here][wwt-home].

[AAS]: https://aas.org/
[TypeScript]: https://www.typescriptlang.org/
[wwt-home]: https://worldwidetelescope.org/home/
[webclient]: https://worldwidetelescope.org/webclient/

[//]: # (numfocus-fiscal-sponsor-attribution)

The WorldWide Telescope project uses an [open governance
model](https://worldwidetelescope.org/about/governance/) and is fiscally
sponsored by [NumFOCUS](https://numfocus.org/). Consider making a
[tax-deductible donation](https://numfocus.org/donate-for-worldwide-telescope)
to help the project pay for developer time, professional services, travel,
workshops, and a variety of other needs.

<div align="center">
  <a href="https://numfocus.org/donate-for-worldwide-telescope">
    <img height="60px"
         src="https://raw.githubusercontent.com/numfocus/templates/master/images/numfocus-logo.png">
  </a>
</div>


## Developers’ quick start

1. Check out this repository to a machine with [Node.js] and [Yarn].
1. `git submodule update --init`
1. `yarn install`
1. Either build or obtain the file `engine/wwtlib/bin/wwtlib.js` as described
   below.
1. `yarn lint` (uses [ESLint])
1. `yarn build` creates:
   1. The core engine package in the `engine/` package.
   1. The engine tidied up into a [Vue]/[Pinia] module in `engine-pinia/`
   1. The WWT embed app intended for iframe inclusion in `embed/`
   1. The WWT research app in `research-app/`
   1. The user-facing app for creating embed iframe code in `embed-creator/`
1. Commands to serve the web apps:
   1. `yarn run serve-embed` to serve the embed app
   1. `yarn run serve-research` to serve the research app
   1. `yarn run serve-creator` to serve the embed creator app
1. `yarn test` (mainly uses [mocha] and [chai]; see also [Integration Testing] below)
1. `yarn doc` (uses [TypeDoc])

[Node.js]: https://nodejs.org/en/
[Yarn]: https://yarnpkg.com/
[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/
[ESLint]: https://eslint.org/
[mocha]: https://mochajs.org/
[chai]: https://www.chaijs.com/
[Integration Testing]: #integration-testing
[TypeDoc]: https://typedoc.org/


## Repository structure

This repository is a [monorepo] containing the source for several interlocking
TypeScript packages that together comprise the core of the WWT web framework.
The most important subdirectories are:

[monorepo]: https://en.wikipedia.org/wiki/Monorepo

- `@wwtelescope/engine` in `engine/`, the core engine code transpiled from C# and
  wrapped in TypeScript annotations
- `@wwtelescope/engine-pinia` in `engine-pinia/`, a higher-level package that turns the
  engine into a reusable [Vue]/[Pinia] component
- `@wwtelescope/embed` in `embed/`, a web application that turns WWT into a
  configurable, embeddable iframe
- `@wwtelescope/research-app` in `research-app/`, an embeddable web application for
  astrophysics research using WWT.
- The narrative documentation in `docs/`

README files inside the individual subdirectories give more information about
their contents and development workflows.

Previous versions used [Vuex] instead of [Pinia] in the `engine-vuex/`
subdirectory. That module has been superseded by the Pinia version.

[Vuex]: https://vuex.vuejs.org/


## The `engine/wwtlib/bin/wwtlib.js` file

There’s one big wrinkle to the build process: the bulk of the engine code is
actually C# code in the directory `engine/wwtlib/`. It’s forked from
[wwt-windows-client] and is transpiled into JavaScript using an unreleased
version of [ScriptSharp], an unmaintained tool. Fortunately, that build process
results in a single file, `engine/wwtlib/bin/wwtlib.js`, that you can download
from our CI systems if you’re not able to perform a Visual Studio build.

[wwt-windows-client]: https://github.com/WorldWideTelescope/wwt-windows-client
[ScriptSharp]: https://github.com/nikhilk/scriptsharp

To build the engine library starting from C#:

1. You need a Windows machine with Visual Studio 2017. Other versions of Visual
   Studio might also work.
1. Open the `engine/WebGLEngine.sln` solution and build the project it contains.
   This should create the file `engine/wwtlib/bin/wwtlib.js`.

Otherwise, check out the latest continuous integration build of this repository,
download the `scriptsharp` artifact, and copy the `wwtlib.js` file to the location
given above. (To find the artifact, go to the appropriate build in this project's
[pipeline] on [Azure DevOps]). Under 'Related', select '9 published', and download
artifacts for `scriptsharp`). If you want to change the C# code, you can file a pull
request and access the artifacts associated with your pull request builds.

[Azure DevOps]: https://azure.microsoft.com/en-us/services/devops/?nav=min
[pipeline]: https://dev.azure.com/aasworldwidetelescope/WWT/_build?definitionId=21



## Building the rest of the code

Besides the creation of the file `engine/wwtlib/bin/wwtlib.js`, virtually
everything in this repository is built using standard [Node.js]/[Yarn] tooling.
These tools must be installed before you can do anything else. To set up your
checkout, follow the instructions in the [Developers’ Quick Start][dqs] above.

[dqs]: #developers-quick-start

Once setup is complete, the following commands will be useful:

- `yarn build` to build the subpackages
- `yarn lint` to lint the subpackages (using [eslint] with TypeScript extensions)
- `yarn test` to run the tests (mainly using [mocha] and [chai])
- `yarn doc` to build most of the documentation (using [TypeDoc]) — but see below
- `yarn clean` to remove built files

You can run these commands from the top level, which will run them for all of
the packages, or from the subdirectory of the package you’re interested in.


## Building the full documentation

Documentation is maintained in subdirectories of `docs/`. The documentation is a
Frankenstein combination of the autogenerated API documentation and narrative
material written in [CommonMark Markdown]. The final HTML is assembled with the
static site generator [Zola].

[CommonMark Markdown]: https://commonmark.org/
[Zola]: https://getzola.org/
[TypeDoc]: https://typedoc.org/

1. Zola is fast and self-contained and [ridiculously easy to
   install][install-zola].
1. The `yarn doc` command will install the autogenerated documentation into
   `docs/engine/static/`
1. Running `zola build` in a subdirectory of `docs` will assembled the final HTML
   into `docs/{subdir}/public/`.
1. The command `zola check` will check the narrative docs for broken links.
1. The command `zola serve` will serve the documentation using a local server
   with autoreload.

[install-zola]: https://www.getzola.org/documentation/getting-started/installation/


## Continuous Integration and Deployment

This repository uses [Cranko] to automate release workflows. This automation is
essential to the smooth and reproducible deployment of the WWT web services.

[Cranko]: https://pkgw.github.io/cranko/


## Integration Testing

Integration testing of the apps is done using [Selenium], [Nightwatch], and
[BrowserStack]. For the main branch, this is triggered automatically with each
commit/pull request. However, the test suite can also be run using a version of
the app on your local machine, either locally (using the Nightwatch binary) or
using BrowserStack (provided that you have a BrowserStack account). In either
case, you may need to modify the `url` in `tests/page_objects/researchApp.js` to
point to the localhost port that you will be using (the default is
`http://localhost:8080`).

[Selenium]: https://www.selenium.dev/
[Nightwatch]: https://nightwatchjs.org/
[BrowserStack]: https://www.browserstack.com/

To run the test suite on a local version of the app with ChromeDriver:

```
yarn run serve-research &  # or equivalent
cd tests
yarn build
yarn local
```

To run tests on a local version of the app via BrowserStack's multi-browser,
multi-platform infrastructure, do the following:

* Set the variables `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` to your BrowserStack
username and access key, respectively. You can find these values in your BrowserStack
[Account Settings].

[Account Settings]: https://www.browserstack.com/accounts/settings

* Run the test suite as above but with the final command: `yarn bs-local`

By default, both of these local options will run the tests in Chrome. You can
adjust the testing environments adding the `-e` option, which can be
accomplished with syntax such as

```
yarn bs-local -e firefox,edge
```


## Getting involved

We love it when people get involved in the WWT community! You can get started
by [participating in our user forum] or by
[signing up for our low-traffic newsletter]. If you would like to help make
WWT better, our [Contributor Hub] aims to be your one-stop shop for
information about how to contribute to the project, with the
[Contributors’ Guide] being the first thing you should read. Here on GitHub we
operate with a standard [fork-and-pull] model.

[participating in our user forum]: https://wwt-forum.org/
[signing up for our low-traffic newsletter]: https://bit.ly/wwt-signup
[Contributor Hub]: https://worldwidetelescope.github.io/
[Contributors’ Guide]: https://worldwidetelescope.github.io/contributing/
[fork-and-pull]: https://help.github.com/en/articles/about-collaborative-development-models

All participation in WWT communities is conditioned on your adherence to the
[WWT Code of Conduct], which basically says that you should not be a jerk.

[WWT Code of Conduct]: https://worldwidetelescope.github.io/code-of-conduct/


## Acknowledgments

The AAS WorldWide Telescope system is a [.NET Foundation] project. Work on WWT
has been supported by the [American Astronomical Society] (AAS), the US
[National Science Foundation] (grants [1550701], [1642446], and [2004840]), the [Gordon
and Betty Moore Foundation], and [Microsoft].

[American Astronomical Society]: https://aas.org/
[.NET Foundation]: https://dotnetfoundation.org/
[National Science Foundation]: https://www.nsf.gov/
[1550701]: https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550701
[1642446]: https://www.nsf.gov/awardsearch/showAward?AWD_ID=1642446
[2004840]: https://www.nsf.gov/awardsearch/showAward?AWD_ID=2004840
[Gordon and Betty Moore Foundation]: https://www.moore.org/
[Microsoft]: https://www.microsoft.com/


## Legalities

The WWT code is licensed under the [MIT License]. The copyright to the code is
owned by the [.NET Foundation].

[MIT License]: https://opensource.org/licenses/MIT
