import { Command } from 'commander';
const program = new Command();
import fs from 'fs';
import path from 'path';

import { reportsFolder, errorsFolder, outputFolder } from './config/index.js';
import { parseReport } from './utils/parseReport.js';
import { transformFiles } from './utils/fs.js';
import { formatConsoleDate, createCurrentDateString } from './utils/date.js';
//@ts-ignore
import json2xlsx from './utils/json2xlsx.cjs';
import { declOfNum } from './utils/declOfNum.js';
import * as log from './utils/log.js';

program
	.command('parse')
	.alias('p')
	.option('--path <path>', 'Путь куда сохранить файлы')
	.description('Перевести отчеты из папки reports в файл summary.json\n Сформировать своды в формате xlsx на основе summary.json')
	.action((options) => {
		fs.promises.readdir(reportsFolder)
			.then(filenames => {
				const filtered = filenames.filter(filename => /\.xml$/.test(filename));
				log.msg(`\nОбнаружено ${filtered.length} XML ${declOfNum(filtered.length, ['отчет', 'отчета', 'отчетов'])}.`)
				return filtered;
			})
			.then(filenames => transformFiles(reportsFolder, filenames, parseReport))
			.then(results => {
				const failedResults = results.filter((result: PromiseSettledResult<unknown>): result is PromiseRejectedResult => result.status === "rejected");
				const fulfilledResults = results.filter(<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> => result.status === "fulfilled");

				if (failedResults.length) {
					const logfilename = createCurrentDateString(new Date) + '.log';

					failedResults.forEach(failedResult => {
						fs.promises.appendFile(
							path.resolve(errorsFolder, logfilename),
							`${formatConsoleDate(new Date())} ${failedResult.reason.filename} ${failedResult.reason.message}\n`)
					});

					log.error(
						`\nВнимание! В ${failedResults.length} ${declOfNum(failedResults.length, ['отчете', 'отчетах', 'отчетах'])} `
						+ `были обнаружены ошибки.\n`
						+ `подробности в логе ошибок: ./errors/${logfilename}\n`
					)
				} else {
					log.done('\nОбработка всех отчетов прошла без ошибок.\n')
				}

				fs.promises.writeFile(
					"summary.json",
					JSON.stringify(
						fulfilledResults.map(fulfilledResult => fulfilledResult.value)
					)
				)

				return fulfilledResults.map(fulfilledResult => fulfilledResult.value)
			})
			.then(resultsArray => resultsArray.length 
				? json2xlsx(resultsArray, options.path || outputFolder)
				: Promise.reject(Error("В summary.json нет данных для обработки"))
			)
			.then(_ => log.done(`Файлы успешно сформированы!`))
			.catch(err => log.error(
				'\nОй, что-то пошло не так!\n'
				+ err.stack
			))
	})

program
	.command('compound')
	.alias('c')
	.option('--path <path>', 'Путь куда сохранить файлы')
	.description('Сформировать своды в формате xlsx на основе summary.json')
	.action((options) => {
		fs.promises.readFile('summary.json', 'utf-8')
			.then(filedata => JSON.parse(filedata))
			.then(dataArray => dataArray.length ?
				json2xlsx(dataArray, options.path || outputFolder)
				: Promise.reject(Error("В summary.json нет данных для обработки"))
			)
			.then(_ => log.done(`Файлы успешно сформированы!`))
			.catch(err => log.error(
				'\nОй, что-то пошло не так!\n'
				+ err.stack
			))
	})

program
	.parse(process.argv);