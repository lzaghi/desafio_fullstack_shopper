export interface InputCsvProps {
  setParentFile: (file: File | undefined) => void;
}

export interface InputCsvRef {
  processFile: () => Promise<jsonData[]>;
}

export interface jsonData {
  [key: string]: string 
}

export interface validatedProduct {
  product_code: number;
  name: string;
  current_price: number;
  new_price: number;
  error: string | null;
}