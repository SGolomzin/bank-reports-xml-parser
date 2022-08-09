import chalk from 'chalk';

type Message = unknown[];

var msg = (...message: Message) => console.log(chalk.grey(...message));
var warn = (...message: Message) => console.log(chalk.yellow(...message));
var error = (...message: Message) => console.log(chalk.red(...message));
var done = (...message: Message) => console.log(chalk.green(...message));

export {
	msg,
	warn,
	error,
	done
}