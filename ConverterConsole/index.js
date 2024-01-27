import fs from "fs";
import * as xlsx from "xlsx";

function isNumber(value) {
  return typeof value === "number";
}

function readExcel() {
  return new Promise((resolve) => {
    let temp = [];
    fs.readdir("./inputs", (error, fileNames) => {
      let temp2 = [];
      if (error) throw error;
      fileNames.forEach((filename) => {
        const data = fs.readFileSync(`./inputs/${filename}`);
        const workbook = xlsx.read(data, { type: "buffer" });
        const sheetName = workbook.SheetNames;
        sheetName.forEach((item, index) => {
          const worksheet = workbook.Sheets[item];
          const json = xlsx.utils.sheet_to_json(worksheet);
          temp2.push({
            points: json
              .filter(
                (fil) =>
                  isNumber(fil[item]) ||
                  isNumber(fil["CTRLCVS"]) ||
                  isNumber(fil["__EMPTY"]) ||
                  isNumber(fil["__EMPTY_1"])
              )
              .map((data) => {
                return {
                  fluidnumber:
                    data[item] == undefined
                      ? parseFloat("0").toFixed(2)
                      : parseFloat(data[item]).toFixed(2),
                  prevalence:
                    data["CTRLCVS"] == undefined
                      ? parseFloat("0").toFixed(2)
                      : parseFloat(data["CTRLCVS"]).toFixed(2),
                  efficiency:
                    data["__EMPTY"] == undefined
                      ? parseFloat("0").toFixed(2)
                      : parseFloat(data["__EMPTY"]).toFixed(2),
                  absorbedPower:
                    data["__EMPTY_1"] == undefined
                      ? parseFloat("0").toFixed(2)
                      : parseFloat(data["__EMPTY_1"]).toFixed(2),
                };
              }),
          });
        });
        temp.push({ curve: temp2.filter((fil) => fil.points.length != 0) });
      });
      resolve(temp);
    });
  });
}

function writeFile(data) {
  fs.writeFileSync(`./outputs/filename.json`, JSON.stringify(data), (err) => {
    if (err) console.log(err);
    else {
      console.log("Finished Conversion");
    }
  });
}

readExcel().then((data) => writeFile(data));
