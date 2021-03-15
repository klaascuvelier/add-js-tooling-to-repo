#!/usr/bin/env node

import { readFileSync, statSync, copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { log, error, logWithPrefix } from './lib/output';
import { merge } from './lib/helpers';
import chalk = require('chalk');

const requiredPackages = [
  'prettier',
  'husky',
  'git-cz',
  'commitlint',
  'lint-staged',
];

const configurationFiles = new Map([
  ['.prettierignore', '.'],
  ['.prettierrc', '.'],
  ['.commitlintrc.json', '.'],
  ['.editorconfig', '.'],
]);

(function addJs(): void {
  logWithPrefix({ title: 'Adding JS tooling to repo' });

  assertRepoRoot();

  const installedPackages = getInstalledPackages();

  const packagesToInstall = getPackagesToInstall(
    requiredPackages,
    installedPackages
  );
  installPackages(packagesToInstall);
  appendExtraConfigToPackageJson();
  copyConfigurationFiles(configurationFiles);
})();

export function assertRepoRoot(): void {
  try {
    statSync('./package.json');
  } catch (err) {
    error({
      title: 'No package.json found',
      bodyLines: [
        'Could not detect package.json in the current folder. Please run this command from the repo root',
      ],
    });
  }
}

export function getInstalledPackages(): string[] {
  const { dependencies, devDependencies } = JSON.parse(
    readFileSync('./package.json', 'utf-8')
  );

  const installedPackagesFlat = Object.keys(dependencies ?? {}).concat(
    Object.keys(devDependencies ?? {})
  );

  return installedPackagesFlat;
}

export function getPackagesToInstall(
  packagesToInstall: string[],
  installedPackages: string[]
): string[] {
  return packagesToInstall.filter((packageName) => {
    return !installedPackages.includes(packageName);
  });
}

export function installPackages(packages: string[]): void {
  execSync(`npm install -D ${packages.join(' ')}`);
  log({
    title: 'Packages',
    bodyLines: [
      `Packages installed: ${packages.map((i) => chalk.cyan(i)).join(`, `)}`,
    ],
  });
}

export function copyConfigurationFiles(
  configurationFiles: Map<string, string>
) {
  configurationFiles.forEach((destFolder, file) => {
    copyFileSync(`${join(__dirname, 'assets', file)}`, join(destFolder, file));
  });

  log({ title: 'Configuration', bodyLines: ['Conugration files copied'] });
}

export function appendExtraConfigToPackageJson(): void {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
  const extraConfig = JSON.parse(
    readFileSync(join(__dirname, 'assets/package.json'), 'utf-8')
  );

  const newPackageJson = merge(packageJson, extraConfig);

  writeFileSync(
    './package.json',
    JSON.stringify(newPackageJson, null, 2),
    'utf-8'
  );

  log({ title: 'Configuration', bodyLines: ['Updated configuration'] });
}
