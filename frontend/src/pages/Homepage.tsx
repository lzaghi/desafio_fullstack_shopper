import { useRef, useState } from "react";
import InputCsv from "../components/InputCsv";
import { InputCsvRef, validatedProduct } from "../interfaces/interfaces";
import { postRequest } from "../services/requests";

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
          products.map((product) => (
            <div key={product.product_code}>
              <p>{product.product_code}</p>
              <p>{product.name}</p>
              <p>{product.current_price}</p>
              <p>{product.new_price}</p>
              <p>{product.error}</p>
            </div>
          ))
        )
      }
    </>
  )
}

export default Homepage