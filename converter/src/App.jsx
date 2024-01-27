import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import * as xlsx from "xlsx";

function App() {
  const [array, setArray] = useState([]);
  const [array2, setArray2] = useState([]);
  const [fileName, setFileName] = useState("");

  function isNumber(value) {
    return typeof value === "number";
  }

  const readUploadFile = (e) => {
    e.preventDefault();
    const files = e.currentTarget.files;

    console.log(files);
    Object.keys(files).forEach((i) => {
      const reader = new FileReader();
      const file = files[i];
      reader.onload = (e) => {
        let tempArray = [];
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames;

        sheetName.forEach((item, index) => {
          const worksheet = workbook.Sheets[item];
          const json = xlsx.utils.sheet_to_json(worksheet);

          tempArray.push({
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
                  prevalnce:
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

        setArray2((prev) => [
          ...prev,
          { curve: tempArray.filter((fil) => fil.points.length != 0) },
        ]);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <input type="file" multiple onChange={(e) => readUploadFile(e)} />
      <a
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(array2)
        )}`}
        download={`file.json`}
      >
        {`Download Json`}
      </a>
    </div>
  );
}

export default App;
