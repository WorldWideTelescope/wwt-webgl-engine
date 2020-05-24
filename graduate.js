// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

"use strict";

const dedent = require("dedent");
const fs = require("fs-extra");
const log = require("npmlog");
const semver = require("semver");

const childProcess = require("@lerna/child-process");
const cli = require("@lerna/cli");
const Command = require("@lerna/command");
const ConventionalCommitUtilities = require("@lerna/conventional-commits");
const ValidationError = require("@lerna/validation-error");


/** Add changelog entries. We tell Lerna not to create changelogs for
 * prereleases, since the chatter would be excessive, so the changelog generated
 * here should include everything since the last non-pre-release.
 */
function addChangeLog(pkg, oldVers, newVers, bumpType) {
  return ConventionalCommitUtilities.updateChangelog(pkg, "independent", {
    changelogPreset: "angular",
    rootPath: ".",
    tagPrefix: "v"
  });
}


/** Find the earliest full-release version of one of our packages that includes
 * the given committish. This is how we determine dependency version
 * requirements.
 */
function findMinimumAcceptableVersion(packageName, committish) {
  const stdout = childProcess.execSync(
    "git",
    [
      "describe",
      "--always",
      "--contains",
      "--match", `${packageName}@*`,
      "--exclude", "*-beta*",
      committish
    ]
  );

  const minimalShaRegex = /^([0-9a-f]{7,40})(-dirty)?$/;
  if (minimalShaRegex.test(stdout)) {
    return null;
  }

  if (!stdout.startsWith(packageName + "@")) {
    log.warn("findMinimumAcceptableVersion", `unexpected describe result: ${stdout}`);
    return null;
  }

  const versionText = stdout.slice(packageName.length + 1).split('~')[0];

  // Check that the text parses as a non-pre-release semver in case something
  // unexpected happened.

  const parsed = semver.parse(versionText);
  if (parsed.prerelease.length) {
    log.warn("findMinimumAcceptableVersion", `bad prerelease-looking describe result: ${stdout}`);
    return null;
  }

  return versionText;
}

/** The command implementation, using the lerna framework. */
class WWTGraduateCommand extends Command {
  configureProperties() {
    super.configureProperties();

    const {
      bumpType,
      packageName
    } = this.options;

    this.bumpType = bumpType;
    this.packageName = packageName;
  }

  initialize() {
    if (!this.project.isIndependent()) {
      throw new ValidationError("EWWTINDEP", "Project must use \"independent\" versioning.");
    }

    if (!this.packageGraph.has(this.packageName)) {
      throw new ValidationError("EWWTNOPKG", `Unrecognized package "${this.packageName}".`);
    }

    this.logger.info("graduate", `Graduating "${this.packageName}" with bump type "${this.bumpType}".`);
    return true;  // means "yes, proceed"
  }

  execute() {
    let node = this.packageGraph.get(this.packageName);
    let chain = Promise.resolve();

    // If this package has local dependencies, ensure that there is a new enough
    // non-pre-release of each of them out there in the world, so that our
    // package's dependencies can actually be satisfied. Required "versions" are
    // expressed as Git commit IDs to make them independent of the assigned
    // version numbering.

    const gitreqs = node.pkg.get('localDepRequiredCommits') || {};

    for (const [depName, depNode] of node.localDependencies) {
      const gitReq = gitreqs[depName];
      if (!gitReq) {
        throw new Error(dedent`
          Cannot graduate ${this.packageName}: its "localDepRequiredCommits" table does
          not have an entry for local dependency ${depName}, so I cannot determine
          the minimum required version needed for publishing.`
        );
      }

      const v = findMinimumAcceptableVersion(depName, gitReq);
      if (!v) {
        throw new Error(dedent`
          Cannot graduate ${this.packageName}: its local dependency ${depName} does not have
          a new enough non-pre-release.`
        );
      }

      const oldNumReq = node.pkg.dependencies[depName];
      if (!oldNumReq) {
        throw new Error(dedent`
          Consistency problem with ${this.packageName}: expected local dependency
          ${depName} but found no numerical version requirement?`
        );
      }

      const newNumReq = "^" + v;

      if (oldNumReq == newNumReq) {
        this.logger.info("graduate", dedent`
          Local dependency "${depName}" version requirement: ${newNumReq}, unchanged`
        );
      } else if (oldNumReq.indexOf("-beta") !== -1) {
        // If the current requirement is for a prerelease, we need to preserve
        // that requirement to allow the build internal to this repo to succeed.
        // This is because NPM's semver behavior treats prereleases specially:
        // `0.1.1-beta.0` is not viewed as satisfying `^0.1.0`, while it does
        // satisy `^0.1.0-beta.0`. So, without the `|| beta` clause, lerna won't
        // believe that the local package satisfies the dependency requirement,
        // leading to build problems. We can't mutate the dependency version
        // just-in-time or anything because the publishing logic all happens
        // inside `lerna publish`.
        const newReq = `${newNumReq} || ${oldNumReq}`
        this.logger.info("graduate", dedent`
          Mutating local dependency "${depName}" version requirement: ${oldNumReq} => ${newReq}`
        );
        node.pkg.dependencies[depName] = newReq;
      } else {
        this.logger.info("graduate", dedent`
          Replacing local dependency "${depName}" version requirement: ${oldNumReq} => ${newNumReq}`
        );
        node.pkg.dependencies[depName] = newNumReq;
      }
    }

    // Time to graduate this package.

    const oldVers = node.version;
    const newVers = semver.inc(oldVers, this.bumpType);
    console.log(`\nGraduating: ${this.packageName} -- ${oldVers} => ${newVers}`);

    node.pkg.version = newVers;
    chain = chain.then(() => node.pkg.serialize());
    chain = chain.then(() => addChangeLog(node.pkg, oldVers, newVers, this.bumpType));
    chain = chain.then(() => {
      // By definition, a release of a package is an event that concerns only that
      // package itself. But, since packages in the monorepo are related, if there
      // are local packages that depend on the one that we've just scheduled for
      // release, it is certainly possible that it might be time to make a new
      // release of one or more of them as well. Suggest this to the user.

      if (node.localDependents.size) {
        console.log("\nConsider also making releases of immediate local dependents:\n");

        for (const [dependentName, dependentNode] of node.localDependents) {
          console.log(`    ${dependentName} (currently ${dependentNode.version})`);
        }
      }

      // We expect that it will be common to want to make multiple releases in
      // one batch. The easiest way to implement that is to do individual
      // packages atomically with guidance about the Git operations to stitch
      // everything together.

      console.log("\nPotential Git commit command:\n");
      console.log(`    git commit -am "Release ${this.packageName} ${newVers} (same as ${oldVers})"`);

      const tag = `${this.packageName}@${newVers}`;
      console.log(`\nYou *must* create an annotated Git tag after committing:\n`);
      console.log(`    git tag ${tag} -m ${tag}\n`);
    });

    return chain;
  }
}

const graduateCmd = {
  // note: parameter names in argv object come from these variables
  command: "wwt-graduate <packageName> <bumpType>",
  describe: "Customized beta-to-release graduation for WWT",

  builder: (yargs, composed) => {
    yargs.positional("packageName", {
      describe: "The package to graduate",
      type: "string"
    });

    const bumpTypes = ["patch", "minor", "major"];

    yargs.positional("bumpType", {
      describe: "Version bump vs. previous release: patch, minor, major",
      type: "string",
      coerce: choice => {
        if (bumpTypes.indexOf(choice) === -1)
          throw new Error("bumpType must be one of: patch, minor, major");
        return choice;
      }
    });
  },

  handler: function handler(argv) {
    new WWTGraduateCommand(argv);
  }
};

let argv = process.argv.slice(2);
argv.unshift("wwt-graduate");
const context = {
  lernaVersion: "*WWT-hacked*"
};
cli().command(graduateCmd).parse(argv, context);
