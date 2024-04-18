import { useState } from "react";
import Papa from "papaparse";

function Homepage() {
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCsvFile(file);
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
      const product = {} as { [key: string]: string };
      row.forEach((cell, index) => {
        product[headers[index]] = cell;
      });
      return product;
    });
    return products;
  }

  const validateFileProducts = async () => {
    const csvFileData = await readCsvFile();

    const dataJson = convertToJson(csvFileData as string[][]);

    console.log(dataJson);
  }

  return (
    <>
      <p>Upload do arquivo CSV:</p>
      <input type="file" id="upload-input" accept=".csv, text/csv" onChange={handleFileChange}/>

      <button disabled={!csvFile} onClick={validateFileProducts}>VALIDAR</button>
      <button>ATUALIZAR</button>
    </>
  )
}

export default Homepage