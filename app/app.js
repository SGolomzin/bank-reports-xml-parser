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
    .description('Перевести отчеты папки reports в файл summary.json')
    .action(() => {
    fs.promises.readdir(reportsFolder)
        .then(filenames => transformFiles(reportsFolder, filenames, parseReport))
        .then(results => {
        const failedResults = results.filter((result) => result.status === "rejected");
        const fulfilledResults = results.filter((result) => result.status === "fulfilled");
        log.msg(`\nОбработано ${results.length} ${declOfNum(results.length, ['отчет', 'отчета', 'отчетов'])}.`);
        if (failedResults.length) {
            const logfilename = createCurrentDateString(new Date) + '.log';
            failedResults.forEach(failedResult => {
                fs.promises.appendFile(path.resolve(errorsFolder, logfilename), `${formatConsoleDate(new Date())} ${failedResult.reason.filename} ${failedResult.reason.message}\n`);
            });
            log.error(`\nВнимание! В ${failedResults.length} ${declOfNum(failedResults.length, ['отчете', 'отчетах', 'отчетах'])} `
                + `были обнаружены ошибки.\n`
                + `подробности в логе ошибок: ./errors/${logfilename}\n`);
        }
        else {
            log.done('\nОбработка всех отчетов прошла без ошибок.\n');
        }
        return fs.promises.writeFile("summary.json", JSON.stringify(fulfilledResults.map(fulfilledResult => fulfilledResult.value)));
    })
        .catch(err => log.error('\nОй, что-то пошло не так!\n'
        + err.stack));
});
program
    .command('compound')
    .alias('c')
    .option('--path <path>', 'Путь куда сохранить файл')
    .description('Сформировать своды в формате xlsx на основе summary.json')
    .action((options) => {
    fs.promises.readFile('summary.json', 'utf-8')
        .then(filedata => JSON.parse(filedata))
        .then(json => json.length ?
        json2xlsx(json, options.path || outputFolder)
        : Promise.reject(Error("В summary.json нет данных для обработки")))
        .then(_ => log.done(`Файлы успешно сформированы!`))
        .catch(err => log.error('\nОй, что-то пошло не так!\n'
        + err.stack));
});
program
    .parse(process.argv);
