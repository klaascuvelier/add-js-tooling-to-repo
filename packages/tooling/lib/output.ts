import * as chalk from 'chalk';

export type OutputInterface = {
  title: string;
  bodyLines?: string[];
};

export const PREFIX = `${chalk.cyan('>')} ${chalk.reset.inverse.bold.cyan(
  ' add-js-tooling-to-repo '
)}`;

export function logWithPrefix({ title }: Pick<OutputInterface, 'title'>): void {
  console.log('');
  console.log(`${PREFIX} ${title}`);
  console.log('');
}

export function log({ title, bodyLines }: OutputInterface): void {
  console.log('');
  console.log(`${chalk.reset.inverse.bold.yellow(` ${title} `)}`);

  if (bodyLines?.length > 0) {
    console.log(bodyLines.join(`\n`));
  }

  console.log('');
}

export function error({ title, bodyLines }): void {
  console.log('');
  console.log(
    `${chalk.reset.inverse.bold.red(
      ` ERROR `
    )} ${chalk.reset.inverse.bold.yellow(` ${title} `)}`
  );

  if (bodyLines?.length > 0) {
    console.log(bodyLines.join(`\n`));
  }

  console.log('');
}
