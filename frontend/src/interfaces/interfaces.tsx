export interface InputCsvProps {
  csvFile: File | undefined;
  setCsvFile: (file: File | undefined) => void;
}

export interface InputCsvRef {
  processFile: () => Promise<jsonData[]>;
}

export interface jsonData {
  [key: string]: string 
}

export interface validatedProduct {
  product_code: string;
  name?: string;
  current_price?: string;
  new_price: string;
  error: string | null;
}