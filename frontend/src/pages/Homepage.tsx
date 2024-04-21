import { useRef, useState } from "react";
import InputCsv from "../components/InputCsv";
import { InputCsvRef, validatedProduct } from "../interfaces/interfaces";
import { postRequest } from "../services/requests";
import ProductCard from "../components/ProductCard";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SyncLoader } from "react-spinners";
import styles from '../css/Homepage.module.css'

function Homepage() {
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [products, setProducts] = useState<validatedProduct[]>([])
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<InputCsvRef>() as React.MutableRefObject<InputCsvRef>;

  const validateFileProducts = async () => {
    setLoading(true);
    const jsonData = await inputRef.current!.processFile();
    try {
      const validatedProducts = await postRequest('/products/validate', jsonData);
      setProducts(validatedProducts);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao validar produtos')
    } finally {
      setLoading(false);
    }
  }

  const updateProducts = async () => {
    setLoading(true);
    try {
      await postRequest('/products/update', products);

      const fileInput = document.getElementById('upload-input') as HTMLInputElement;
      fileInput.value = '';

      setProducts([]);
      toast.success('Produtos atualizados com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao atualizar produtos')
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ styles.container }>
      <InputCsv setParentFile={setCsvFile} ref={inputRef}/>

      <button disabled={!csvFile} onClick={validateFileProducts}>VALIDAR</button>
      <button disabled={!products.length || products.some((p) => p.error)} onClick={updateProducts}>ATUALIZAR</button>
      <SyncLoader loading={loading} size={10} color={'gray'}
        cssOverride={ { position: "absolute", top: '12px', right: '50%', transform: 'translateX(50%)' } }
      />

      {
        !!products.length && (
          <div className={ styles.productsContainer }>
            {
              products.map((product, index) => (
                <ProductCard product={ product } key={ index }/>
              ))
            }
          </div>
        )
      }

      <ToastContainer />
    </div>
  )
}

export default Homepage