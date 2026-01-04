import { Dataset, TransformStep } from './types';
import { profileDataset } from './profile';

export function applyTransform(dataset: Dataset, transform: TransformStep): any[] {
  let data = [...dataset.rawData];

  switch (transform.type) {
    case 'dropNulls':
      data = data.filter((row) => {
        const cols = transform.config.columns || [];
        return cols.every((col: string) => row[col] != null && row[col] !== '');
      });
      break;

    case 'fillNulls':
      const fillColumns = transform.config.columns || [];
      const fillValue = transform.config.value;
      data = data.map((row) => {
        const newRow = { ...row };
        fillColumns.forEach((col: string) => {
          if (newRow[col] == null || newRow[col] === '') {
            if (fillValue === 'mean' && dataset.columnProfiles.find((p) => p.name === col)?.stats?.mean != null) {
              newRow[col] = dataset.columnProfiles.find((p) => p.name === col)!.stats!.mean;
            } else {
              newRow[col] = fillValue;
            }
          }
        });
        return newRow;
      });
      break;

    case 'trimText':
      const trimColumns = transform.config.columns || [];
      data = data.map((row) => {
        const newRow = { ...row };
        trimColumns.forEach((col: string) => {
          if (typeof newRow[col] === 'string') {
            newRow[col] = newRow[col].trim();
          }
        });
        return newRow;
      });
      break;

    case 'parseNumbers':
      const numColumns = transform.config.columns || [];
      data = data.map((row) => {
        const newRow = { ...row };
        numColumns.forEach((col: string) => {
          if (typeof newRow[col] === 'string') {
            const cleaned = newRow[col].replace(/,/g, '');
            const parsed = parseFloat(cleaned);
            newRow[col] = isNaN(parsed) ? newRow[col] : parsed;
          }
        });
        return newRow;
      });
      break;

    case 'parseDates':
      const dateColumns = transform.config.columns || [];
      data = data.map((row) => {
        const newRow = { ...row };
        dateColumns.forEach((col: string) => {
          if (typeof newRow[col] === 'string') {
            const parsed = new Date(newRow[col]);
            newRow[col] = isNaN(parsed.getTime()) ? newRow[col] : parsed.toISOString();
          }
        });
        return newRow;
      });
      break;

    case 'selectColumns':
      const selectedCols = transform.config.columns || [];
      data = data.map((row) => {
        const newRow: any = {};
        selectedCols.forEach((col: string) => {
          newRow[col] = row[col];
        });
        return newRow;
      });
      break;
  }

  return data;
}

export function createTransformedDataset(
  dataset: Dataset,
  transforms: TransformStep[]
): Dataset {
  let data = [...dataset.rawData];

  transforms.forEach((transform) => {
    const tempDataset = { ...dataset, rawData: data };
    data = applyTransform(tempDataset, transform);
  });

  const columns =
    transforms.some((t) => t.type === 'selectColumns')
      ? transforms.find((t) => t.type === 'selectColumns')!.config.columns
      : dataset.columns;

  const filteredData = data.map((row) => {
    const newRow: any = {};
    columns.forEach((col: string) => {
      newRow[col] = row[col];
    });
    return newRow;
  });

  const columnProfiles = profileDataset(filteredData, columns);

  return {
    ...dataset,
    id: `${dataset.id}-transformed-${Date.now()}`,
    name: `${dataset.name} (transformed)`,
    rawData: filteredData,
    rows: filteredData.map((row) => columns.map((col: string) => row[col])),
    columns,
    columnProfiles,
  };
}

