// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

"use strict";

const fs = require("fs-extra");
const log = require("npmlog");
const semver = require("semver");

const cli = require("@lerna/cli");
const Command = require("@lerna/command");
const ConventionalCommitUtilities = require("@lerna/conventional-commits");
const ValidationError = require("@lerna/validation-error");

function addChangeLog(pkg, oldVers, newVers, bumpType) {
  const { BLANK_LINE, CHANGELOG_HEADER, EOL } = require("@lerna/conventional-commits/lib/constants");
  const readExistingChangelog = require("@lerna/conventional-commits/lib/read-existing-changelog");

  const dateObj = new Date();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const date = `${year}-${month}-${day}`;

  const pfx = bumpType == "patch" ? "##" : "#";

  const newEntry = `${pfx} ${newVers} (${date})\n\nGraduating pre-release version ${oldVers} to full release ${newVers}.`;

  return readExistingChangelog(pkg).then(([changelogFileLoc, changelogContents]) => {
    const content = [CHANGELOG_HEADER, newEntry, changelogContents].join(BLANK_LINE);

    return fs.writeFile(changelogFileLoc, content.trim() + EOL).then(() => {
      return {
        logPath: changelogFileLoc,
        newEntry,
      };
    });
  });
}

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

    for (const [depName, depNode] of node.localDependencies) {
      throw new Error("TODO: implement local dep version checking");
    }

    // Time to graduate this package.

    const oldVers = node.version;
    const newVers = semver.inc(oldVers, this.bumpType);
    console.log(`\nGraduating: ${this.packageName} -- ${oldVers} => ${newVers}`);

    node.pkg.version = newVers;
    chain = chain.then(() => node.pkg.serialize());
    chain = chain.then(() => addChangeLog(node.pkg, oldVers, newVers, this.bumpType));

    // By definition, a release of a package is an event that concerns only that
    // package itself. But, since packages in the monorepo are related, if there
    // are local packages that depend on the one that we've just scheduled for
    // release, it is certainly possible that it might be time to make a new
    // release of one or more of them as well. Suggest this to the user.

    chain = chain.then(() => {
      if (node.localDependents.size) {
        console.log("\nConsider also making releases of immediate local dependents:\n");

        for (const [dependentName, dependentNode] of node.localDependents) {
          console.log(`    ${dependentName} (currently ${dependentNode.version})`);
        }
      }

      console.log("\nPotential Git commit command:\n");
      console.log(`    git commit -am "Release ${this.packageName} ${newVers} (same as ${oldVers})"`);

      const tag = `${this.packageName}@${newVers}`;
      console.log(`\nYou *must* create an annotated Git tag after committing:\n`);
      console.log(`   git tag ${tag} -m ${tag}\n`);
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
