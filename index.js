const fs = require("fs");
const xlsx = require("xlsx");
const jsontoxml = require("jsontoxml");

const workbook = xlsx.readFile("../liste comptes bancaires.xlsx");
const workbookRwb = xlsx.readFile("../data Q4 2020 Ministère.xlsx");

let workSheetsRwb = {};
let workSheets = {};

for (let sheetName of workbook.SheetNames) {
	workSheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

for (let sheetName of workbookRwb.SheetNames) {
	workSheetsRwb[sheetName] = xlsx.utils.sheet_to_json(
		workbook.Sheets[sheetName]
	);
}
jsontoxml(
	{
		workSheets: JSON.parse(JSON.stringify(Object.values(workSheets))).map(
			(workSheet) =>
				workSheet.map((data) => {
					for (property in data) {
						const newPropertyname = property.replace(/\s/g, "");
						if (property !== newPropertyname) {
							Object.defineProperty(
								data,
								newPropertyname,
								Object.getOwnPropertyDescriptor(data, property)
							);
							delete data[property];
						}
					}
					return data;
				})
		)
	},
	{}
);

console.log(JSON.stringify(workSheets));

const express = require("express");

const app = express();

app.use("/etat", (req, res) => {
	res.status(200).send(workSheets);
});

app.use("/rwb", (req, res) => {
	res.status(200).send(workSheetsRwb);
});

app.listen(3500, () => {
	console.log("bonjour");
});
