"use strict";
const XLSX = require('xlsx');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const json2xlsx = (jsondata = [], outputDir = '') => {
    jsondata.forEach(report => {
        let workbook = XLSX.utils.book_new();
        let sheet = XLSX.utils.json_to_sheet(report.parsed);
        XLSX.utils.book_append_sheet(workbook, sheet, "summary");
        let outputFilename = report.filename || generateFilename();
        XLSX.writeFile(workbook, path.resolve(outputDir, outputFilename + ".xlsx"));
    });
};
const generateFilename = () => uuidv4();
module.exports = json2xlsx;
