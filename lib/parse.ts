import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Dataset } from './types';
import { profileDataset } from './profile';

export async function parseCSV(file: File, name: string): Promise<Dataset> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && !results.data.length) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }

        const data = results.data as any[];
        if (data.length === 0) {
          reject(new Error('CSV file is empty or has no valid rows'));
          return;
        }

        const columns = Object.keys(data[0] || {});
        if (columns.length === 0) {
          reject(new Error('CSV file has no columns'));
          return;
        }

        const rows = data.map((row) => columns.map((col) => row[col]));
        const columnProfiles = profileDataset(data, columns);

        const dataset: Dataset = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          name,
          rows,
          columns,
          columnProfiles,
          rawData: data,
          createdAt: Date.now(),
        };

        resolve(dataset);
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}

export async function parseExcel(file: File, sheetName?: string): Promise<Dataset[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const datasets: Dataset[] = [];

        const sheetsToProcess = sheetName
          ? [sheetName]
          : workbook.SheetNames;

        sheetsToProcess.forEach((name) => {
          const worksheet = workbook.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            return;
          }

          const columns = Object.keys(jsonData[0] as any);
          if (columns.length === 0) {
            return;
          }

          const rows = jsonData.map((row: any) => columns.map((col) => row[col]));
          const columnProfiles = profileDataset(jsonData, columns);

          datasets.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            name: `${file.name} - ${name}`,
            rows,
            columns,
            columnProfiles,
            rawData: jsonData,
            createdAt: Date.now(),
          });
        });

        if (datasets.length === 0) {
          reject(new Error('Excel file has no valid sheets with data'));
          return;
        }

        resolve(datasets);
      } catch (error: any) {
        reject(new Error(`Failed to parse Excel: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function getSheetNames(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook.SheetNames);
      } catch (error: any) {
        reject(new Error(`Failed to read Excel file: ${error.message}`));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    reader.readAsArrayBuffer(file);
  });
}

