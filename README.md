[![Build Status](https://dev.azure.com/aasworldwidetelescope/WWT/_apis/build/status/WorldWideTelescope.wwt-webgl-engine?branchName=cranko)](https://dev.azure.com/aasworldwidetelescope/WWT/_build/latest?definitionId=21&branchName=cranko)
[![npm](https://img.shields.io/npm/v/@wwtelescope/astro?label=@wwtelescope/astro)](https://www.npmjs.com/package/@wwtelescope/astro)
[![npm](https://img.shields.io/npm/v/@wwtelescope/embed?label=@wwtelescope/embed)](https://www.npmjs.com/package/@wwtelescope/embed)
[![npm](https://img.shields.io/npm/v/@wwtelescope/embed-common?label=@wwtelescope/embed-common)](https://www.npmjs.com/package/@wwtelescope/embed-common)
[![npm](https://img.shields.io/npm/v/@wwtelescope/embed-creator?label=@wwtelescope/embed-creator)](https://www.npmjs.com/package/@wwtelescope/embed-creator)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine?label=@wwtelescope/engine)](https://www.npmjs.com/package/@wwtelescope/engine)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine-helpers?label=@wwtelescope/engine-helpers)](https://www.npmjs.com/package/@wwtelescope/engine-helpers)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine-types?label=@wwtelescope/engine-types)](https://www.npmjs.com/package/@wwtelescope/engine-types)
[![npm](https://img.shields.io/npm/v/@wwtelescope/engine-vuex?label=@wwtelescope/engine-vuex)](https://www.npmjs.com/package/@wwtelescope/engine-vuex)
[![npm](https://img.shields.io/npm/v/@wwtelescope/research-app?label=@wwtelescope/research-app)](https://www.npmjs.com/package/@wwtelescope/research-app)
[![npm](https://img.shields.io/npm/v/@wwtelescope/research-app-messages?label=@wwtelescope/research-app-messages)](https://www.npmjs.com/package/@wwtelescope/research-app-messages)

# The AAS WorldWide Telescope WebGL engine

The “WebGL engine” of the [AAS] [WorldWide Telescope][wwt-home] (WWT) is a
JavaScript/[TypeScript] framework that powers the Web-based versions of the WWT
visualization software, as exemplified by the [WWT web client][webclient].

Learn more about WWT [here][wwt-home].

[AAS]: https://aas.org/
[TypeScript]: https://www.typescriptlang.org/
[wwt-home]: https://worldwidetelescope.org/home/
[webclient]: https://worldwidetelescope.org/webclient/


## Developers’ quick start

1. Check out this repository to a machine with [Node.js] and [npm].
1. `git submodule update --init`
1. `npx lerna bootstrap`
1. Either build or obtain the file `engine/wwtlib/bin/wwtlib.js` as described
   below.
1. `npm run lint` (uses [ESLint])
1. `npm run build` creates:
   1. The core engine package in the `engine/` package.
   1. The engine tidied up into a [Vue]/[Vuex] module in `engine-vuex/`
   1. The WWT embed app intended for iframe inclusion in `embed/`
   1. The WWT research app in `research-app/`
   1. The user-facing app for creating embed iframe code in `embed-creator/`
1. Commands to serve the web apps:
   1. `npm run serve-embed` to serve the embed app
   1. `npm run serve-research` to serve the research app
   1. `npm run serve-creator` to serve the embed creator app
1. `npm run test` (mainly uses [mocha] and [chai])
1. `npm run doc` (uses [TypeDoc])

[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/get-npm
[Vue]: https://vuejs.org/
[Vuex]: https://vuex.vuejs.org/
[ESLint]: https://eslint.org/
[mocha]: https://mochajs.org/
[chai]: https://www.chaijs.com/
[TypeDoc]: https://typedoc.org/


## Repository structure

This repository is a [monorepo] containing the source for several interlocking
TypeScript packages that together comprise the core of the WWT web framework.
The most important subdirectories are:

[monorepo]: https://en.wikipedia.org/wiki/Monorepo

- `@wwtelescope/engine` in `engine/`, the core engine code transpiled from C# and
  wrapped in TypeScript annotations
- `@wwtelescope/engine-vuex` in `engine-vuex/`, a higher-level package that turns the
  engine into a reusable [Vue]/[Vuex] component
- `@wwtelescope/embed` in `embed/`, a web application that turns WWT into a
  configurable, embeddable iframe
- `@wwtelescope/research-app` in `research-app/`, an embeddable web application for
  astrophysics research using WWT.
- The narrative documentation in `docs/`

README files inside the individual subdirectories give more information about
their contents and development workflows.


## The `engine/wwtlib/bin/wwtlib.js` file

There’s one big wrinkle to the build process: the bulk of the engine code is
actually C# code in the directory `engine/wwtlib/`. It’s forked from
[wwt-windows-client] and is transpiled into JavaScript using an unreleased
version of [ScriptSharp], an unmaintained tool. Fortunately, that build process
results in a single file, `engine/wwtlib/bin/wwtlib.js`, that you can download
from our CI systems if you’re not able to perform a Visual Stdio build.

[wwt-windows-client]: https://github.com/WorldWideTelescope/wwt-windows-client
[ScriptSharp]: https://github.com/nikhilk/scriptsharp

To build the engine library starting from C#:

1. You need a Windows machine with Visual Studio 2017. Other versions of Visual
   Studio might also work.
1. Open the `engine/WebGLEngine.sln` solution and build the project it contains.
   This should create the file `engine/wwtlib/bin/wwtlib.js`.

Otherwise, check out the latest continuous integration build of this repository,
download the `scriptsharp` artifact, and copy the `wwtlib.js` file to the
location given above. If you want to change the C# code, you can file a pull
request and access the artifacts associated with your pull request builds.


## Building the rest of the code

Besides the creation of the file `engine/wwtlib/bin/wwtlib.js`, virtually
everything in this repository is built using standard [Node.js]/[npm] tooling.
These tools must be installed before you can do anything else.

The multi-package structure of this repository is dealt with using [Lerna]. This
means that once you’ve checked out the code and install [npm], the setup
sequence is:

[Lerna]: https://lerna.js.org/

1. Run `git submodule update --init` to pull in needed Git submodules, namely
   the documentation theme in `docs/*/themes/wwtguide`.
1. Run `npx lerna bootstrap` to install all of the project dependencies and set
   up the necessary cross-links between individual packages in this repository.

Once setup is complete, the following commands will be useful:

- `npm run build` to build the subpackages
- `npm run lint` to lint the subpackages (using [eslint] with TypeScript extensions)
- `npm run test` to run the tests (mainly using [mocha] and [chai])
- `npm run doc` to build most of the documentation (using [TypeDoc]) — but see below

Running these commands from inside package subdirectories unfortunately *will
not* work due to the centralized `node_modules` directory we use with Lerna. To
run the `lint` command only for the `engine-types` submodule, run:

```
npx lerna run --scope @wwtelescope/engine-types lint
```

(The `--scope` argument can be a glob expression if you want to run on a subset
of packages.)


## Building the full documentation

Documentation is maintained in subdirectories of `docs/`. The documentation is a
Frankenstein combination of the autogenerated API documentation and narrative
material written in [CommonMark Markdown]. The final HTML is assembled with the
static site generator [Zola],

[CommonMark Markdown]: https://commonmark.org/
[Zola]: https://getzola.org/
[TypeDoc]: https://typedoc.org/

1. Zola is fast and self-contained and [ridiculously easy to
   install][install-zola].
1. The `npm run doc` command will install the autogenerated documentation into
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
