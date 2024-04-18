export interface InputCsvProps {
  setParentFile: (file: File | undefined) => void;
}

export interface InputCsvRef {
  processFile: () => Promise<jsonData[]>;
}

export interface jsonData {
  [key: string]: string 
}
