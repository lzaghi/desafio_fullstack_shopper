import { forwardRef, useImperativeHandle, useState } from "react";
import Papa from "papaparse";
import { InputCsvProps, InputCsvRef, jsonData } from "../interfaces/interfaces";

const InputCsv = forwardRef<InputCsvRef, InputCsvProps>(({ setParentFile }, ref) => {
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCsvFile(file);
    setParentFile(file);
  }

  const readCsvFile = () => {
    return new Promise((resolve) => {
      Papa.parse(csvFile!, {
        skipEmptyLines: true,
        complete: (result) => {
          const csvFileData = result.data;
          resolve(csvFileData);
        }
      });
    });
  }

  const convertToJson = (csvData: string[][]) => {
    const headers = csvData[0];
    const products = csvData.slice(1).map((row) => {
      const product = {} as jsonData;
      row.forEach((cell, index) => {
        product[headers[index]] = cell;
      });
      return product;
    });
    return products;
  }

  useImperativeHandle(ref, () => ({
    async processFile() {
      const csvFileData = await readCsvFile();

      const dataJson = convertToJson(csvFileData as string[][]);

      return dataJson;
    }
  }));

  return (
    <>
      <p>Upload do arquivo CSV:</p>
      <input type="file" id="upload-input" accept=".csv, text/csv" onChange={handleFileChange}/>
    </>
  )
})

export default InputCsv