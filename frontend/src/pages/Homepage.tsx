import { useRef, useState } from "react";
import InputCsv from "../components/InputCsv";
import { InputCsvRef } from "../interfaces/interfaces";

function Homepage() {
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);

  const inputRef = useRef<InputCsvRef>() as React.MutableRefObject<InputCsvRef>;

  const validateFileProducts = async () => {
    const jsonData = await inputRef.current!.processFile();

    console.log('chegou', jsonData);
  }

  return (
    <>
      <InputCsv setParentFile={setCsvFile} ref={inputRef}/>

      <button disabled={!csvFile} onClick={validateFileProducts}>VALIDAR</button>
      <button>ATUALIZAR</button>
    </>
  )
}

export default Homepage