import fs from 'fs';
import YAML from 'yaml';

const readTemplate = (path) => {
	const file = fs.readFileSync(path, 'utf-8');
	return YAML.parse(file);
};

export {
	readTemplate
}