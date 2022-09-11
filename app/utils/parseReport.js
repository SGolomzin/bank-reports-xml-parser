import libxmljs2 from 'libxmljs2';
import * as ecnodeUtils from './encoding.js';
import { templateOKSfilepath, templateNSKIfilepath } from '../config/index.js';
import { readTemplate } from './readTemplate.js';
import { parseDateValue } from './date.js';
import { allValuesEmpty } from './allValuesEmpty.js';
const parseReport = (buf, filename = '') => {
    return new Promise((resolve, reject) => {
        let filedata = "";
        if (ecnodeUtils.isEncoding(buf.toString(), 'windows-1251')) {
            filedata = ecnodeUtils.decodeWIN1251(buf);
            filedata = ecnodeUtils.replaceEncodingAttr(filedata, 'utf-8');
        }
        const PARSED_REPORT = {
            filename: filename.match(/.+(?=\..+)/g)?.[0] || "invalid_filename",
            parsed: []
        };
        const xml = libxmljs2.parseXml(filedata, { noblanks: true });
        let pathToYAMLtemplate = "";
        switch (xml.root()?.name()) {
            case 'product':
                pathToYAMLtemplate = templateNSKIfilepath;
                break;
            case 's':
                pathToYAMLtemplate = templateOKSfilepath;
                break;
        }
        const reportTemplate = readTemplate(pathToYAMLtemplate);
        if (!isValid(reportTemplate))
            return reject(Error("В шаблоне отсутствуют обязательные поля"));
        const path = reportTemplate.path;
        let currentNode = xml.root();
        if (!currentNode)
            return reject(Error("В отчете отсутствует корневой элемент"));
        for (let step of path) {
            let [command, XPath] = Object.entries(step).flat();
            currentNode = currentNode[command](XPath);
        }
        if (!Array.isArray(currentNode))
            currentNode = [currentNode];
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
                let value = node.get(valueXPath)?.text() || reportTemplate.parse[key]?.emptyValue || '';
                let type = reportTemplate.parse[key]?.type || 's';
                if (reportTemplate.parse[key]?.type === 'd' && value !== '') {
                    value = parseDateValue(value, reportTemplate.parse[key]?.dateFormat, reportTemplate.parse[key]?.dateFormatStrict);
                }
                else if (reportTemplate.parse[key]?.type === 'd' && value === '') {
                    type = 's';
                }
                parsedData[keyName] = { "v": value, "t": type };
            }
            if (!allValuesEmpty(parsedData))
                PARSED_REPORT.parsed.push(parsedData);
        }
        return resolve(PARSED_REPORT);
    });
};
const isValid = (template) => {
    if (!template)
        return false;
    return Boolean(template.name
        && template.path
        && Array.isArray(template.path)
        && template.parseBy
        && template.parse);
};
export { parseReport };
