declare module 'papaparse' {
  export interface ParseConfig {
    header?: boolean;
    skipEmptyLines?: boolean;
    complete?: (results: ParseResult) => void;
    error?: (error: Error) => void;
  }

  export interface ParseResult {
    data: any[];
    errors: ParseError[];
    meta: ParseMeta;
  }

  export interface ParseError {
    type: string;
    code: string;
    message: string;
    row: number;
  }

  export interface ParseMeta {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    fields: string[];
    truncated: boolean;
  }

  export interface Papa {
    parse(file: File | string, config: ParseConfig): void;
  }

  const Papa: Papa;
  export default Papa;
}

