import chalk from 'chalk';
var msg = (...message) => console.log(chalk.grey(...message));
var warn = (...message) => console.log(chalk.yellow(...message));
var error = (...message) => console.log(chalk.red(...message));
var done = (...message) => console.log(chalk.green(...message));
export { msg, warn, error, done };
