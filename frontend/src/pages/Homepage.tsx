import { useRef, useState } from "react";
import InputCsv from "../components/InputCsv";
import { InputCsvRef, validatedProduct } from "../interfaces/interfaces";
import { postRequest } from "../services/requests";
import ProductCard from "../components/ProductCard";

function Homepage() {
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [products, setProducts] = useState<validatedProduct[]>([])

  const inputRef = useRef<InputCsvRef>() as React.MutableRefObject<InputCsvRef>;

  const validateFileProducts = async () => {
    const jsonData = await inputRef.current!.processFile();

    const validatedProducts = await postRequest('/products/validate', jsonData);
    console.log('chegou', validatedProducts);
    setProducts(validatedProducts);
  }

  return (
    <>
      <InputCsv setParentFile={setCsvFile} ref={inputRef}/>

      <button disabled={!csvFile} onClick={validateFileProducts}>VALIDAR</button>
      <button>ATUALIZAR</button>

      {
        !!products.length && (
          products.map((product, index) => (
            <ProductCard product={ product } key={ index }/>
          ))
        )
      }
    </>
  )
}

export default Homepage