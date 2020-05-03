// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

const prepare = async (_pluginConfig, { nextRelease: { version }, logger }) => {
  const packageSanitized = process.env.LERNA_PACKAGE_NAME.replace(/[^a-zA-Z0-9_]/g, '_');

  const fullVersionVar = `newVersion${packageSanitized}`;
  logger.log(`Setting variable ${fullVersionVar} to ${version}`);
  console.log(`##vso[task.setvariable variable=${fullVersionVar}]${version}`);

  const majMin = version.split('.').slice(0, 2).join('.');
  const majMinVar = `newMajMin${packageSanitized}`;
  logger.log(`Setting variable ${majMinVar} to ${majMin}`);
  console.log(`##vso[task.setvariable variable=${majMinVar}]${majMin}`);
};

module.exports = {
  prepare
}