// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

const prepare = async (_pluginConfig, { nextRelease: { version }, logger }) => {
  const packageSanitized = process.env.LERNA_PACKAGE_NAME.replace(/[^a-zA-Z0-9_]/g, '_');
  const varName = `newVersion${packageSanitized}`;
  logger.log(`Setting variable ${varName} to ${version}`);
  console.log(`##vso[task.setvariable variable=${varName}]${version}`);
};

module.exports = {
  prepare
}