import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reportsFolder = path.resolve(__dirname, "../reports");
const errorsFolder = path.resolve(__dirname, "../errors");
const templatesFolder = path.resolve(__dirname, "../templates");
const outputFolder = path.resolve(__dirname, "../output");

const templateNSKIfilepath = path.resolve(__dirname, "../templates/nski.yml");
const templateOKSfilepath = path.resolve(__dirname, "../templates/oks.yml");

export {
	reportsFolder,
	errorsFolder,
	templatesFolder,
	outputFolder,
	templateNSKIfilepath,
	templateOKSfilepath
}