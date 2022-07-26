import libxmljs2 from 'libxmljs2';
import * as ecnodeUtils from './encoding.js';
import { templateOKSfilepath, templateNSKIfilepath } from '../config/index.js';
import { readTemplate } from './readTemplate.js';

const parseReport = (filedata, filename = '') => {
	return new Promise((resolve, reject) => {
		if (ecnodeUtils.isEncoding(filedata.toString(), 'windows-1251')) {
			filedata = ecnodeUtils.decodeWIN1251(filedata);
			filedata = ecnodeUtils.replaceEncodingAttr(filedata, 'utf-8');
		}

		const PARSED_REPORT = { filename: filename.match(/.+(?=\..+)/g)?.[0] };

		const xml = libxmljs2.parseXml(filedata, { noblanks: true })

		let pathToYAMLtemplate;
		switch (xml.root().name()) {
			case 'product':
				pathToYAMLtemplate = templateNSKIfilepath;
				break;
			case 's':
				pathToYAMLtemplate = templateOKSfilepath;
				break;
		}

		const reportTemplate = readTemplate(pathToYAMLtemplate);

		if (!isValid(reportTemplate)) return reject(Error("В шаблоне отсутствуют обязательные поля"));

		const path = reportTemplate.path;
		let currentNode = xml;

		for (let step of path) {
			let [command, XPath] = Object.entries(step).flat();
			currentNode = currentNode[command](XPath);
		}

		if (!Array.isArray(currentNode)) currentNode = [currentNode];

		PARSED_REPORT.parsed = [];

		for (let node of currentNode) {
			let parsedData = {};
			for (let key of Object.keys(reportTemplate.parse)) {
				let keyName = reportTemplate.parse[key]?.as || key;

				let valueXPath = '';
				switch (reportTemplate.parseBy) {
					case 'element':
						valueXPath = key;
						break;
					case 'attribute':
						valueXPath = `*[@n='${key}']`;
						break;
				}

				let value = node.get(valueXPath)?.text() || reportTemplate.parse[key]?.replacer || '';

				parsedData[keyName] = { "v": value, "t": reportTemplate.parse[key]?.type || 's' };
			}

			PARSED_REPORT.parsed.push(parsedData);
		}

		return resolve(PARSED_REPORT);
	})
}

const isValid = (template) => {
	return Boolean(template.name
		&& template.path
		&& Array.isArray(template.path)
		&& template.parseBy
		&& template.parse)
}

export { parseReport }