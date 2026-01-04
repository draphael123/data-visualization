import { Dataset, ChartConfig, ColumnProfile } from './types';

export function recommendCharts(dataset: Dataset): ChartConfig[] {
  const recommendations: ChartConfig[] = [];
  const { columns, columnProfiles, rawData } = dataset;

  const numericCols = columnProfiles.filter((p) => p.type === 'number').map((p) => p.name);
  const dateCols = columnProfiles.filter((p) => p.type === 'date').map((p) => p.name);
  const categoryCols = columnProfiles.filter((p) => p.type === 'category').map((p) => p.name);

  // Time series: numeric + date
  if (numericCols.length > 0 && dateCols.length > 0) {
    recommendations.push({
      id: `rec-${Date.now()}-1`,
      datasetId: dataset.id,
      title: `${numericCols[0]} over Time`,
      type: 'line',
      xAxis: dateCols[0],
      yAxis: numericCols[0],
      data: aggregateData(rawData, dateCols[0], numericCols[0], 'avg', 'day'),
    });
  }

  // Bar chart: numeric + category
  if (numericCols.length > 0 && categoryCols.length > 0) {
    const catCol = categoryCols[0];
    const numCol = numericCols[0];
    recommendations.push({
      id: `rec-${Date.now()}-2`,
      datasetId: dataset.id,
      title: `${numCol} by ${catCol}`,
      type: 'bar',
      xAxis: catCol,
      yAxis: numCol,
      aggregation: 'sum',
      data: aggregateData(rawData, catCol, numCol, 'sum'),
    });
  }

  // Scatter: 2 numeric
  if (numericCols.length >= 2) {
    recommendations.push({
      id: `rec-${Date.now()}-3`,
      datasetId: dataset.id,
      title: `${numericCols[0]} vs ${numericCols[1]}`,
      type: 'scatter',
      xAxis: numericCols[0],
      yAxis: numericCols[1],
      data: rawData.map((row) => ({
        x: parseFloat(row[numericCols[0]]) || 0,
        y: parseFloat(row[numericCols[1]]) || 0,
      })),
    });
  }

  // Histogram: single numeric
  if (numericCols.length > 0) {
    const numCol = numericCols[0];
    recommendations.push({
      id: `rec-${Date.now()}-4`,
      datasetId: dataset.id,
      title: `Distribution of ${numCol}`,
      type: 'histogram',
      xAxis: numCol,
      data: createHistogramData(rawData, numCol),
    });
  }

  return recommendations;
}

export function aggregateData(
  data: any[],
  groupBy: string,
  valueCol: string,
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max',
  dateBucket?: 'day' | 'week' | 'month' | 'year'
): any[] {
  const groups = new Map<string, number[]>();

  data.forEach((row) => {
    let key = row[groupBy];
    if (dateBucket && row[groupBy]) {
      const date = new Date(row[groupBy]);
      if (!isNaN(date.getTime())) {
        key = bucketDate(date, dateBucket).toISOString();
      }
    }
    const keyStr = String(key);
    if (!groups.has(keyStr)) {
      groups.set(keyStr, []);
    }
    const value = parseFloat(row[valueCol]);
    if (!isNaN(value)) {
      groups.get(keyStr)!.push(value);
    }
  });

  const result: any[] = [];
  groups.forEach((values, key) => {
    let aggValue: number;
    switch (aggregation) {
      case 'sum':
        aggValue = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        aggValue = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'count':
        aggValue = values.length;
        break;
      case 'min':
        aggValue = Math.min(...values);
        break;
      case 'max':
        aggValue = Math.max(...values);
        break;
    }

    result.push({
      [groupBy]: key,
      value: aggValue,
    });
  });

  return result.sort((a, b) => {
    if (dateBucket) {
      return new Date(a[groupBy]).getTime() - new Date(b[groupBy]).getTime();
    }
    return String(a[groupBy]).localeCompare(String(b[groupBy]));
  });
}

function bucketDate(date: Date, bucket: 'day' | 'week' | 'month' | 'year'): Date {
  const d = new Date(date);
  switch (bucket) {
    case 'year':
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
      break;
    case 'month':
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      break;
    case 'day':
      d.setHours(0, 0, 0, 0);
      break;
  }
  return d;
}

export function createHistogramData(data: any[], column: string, bins: number = 20): any[] {
  const values = data
    .map((row) => parseFloat(row[column]))
    .filter((v) => !isNaN(v));

  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;

  const binsMap = new Map<number, number>();

  values.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    const binStart = min + binIndex * binWidth;
    binsMap.set(binStart, (binsMap.get(binStart) || 0) + 1);
  });

  return Array.from(binsMap.entries())
    .map(([binStart, count]) => ({
      bin: binStart.toFixed(2),
      count,
    }))
    .sort((a, b) => parseFloat(a.bin) - parseFloat(b.bin));
}

export function computeCorrelations(data: any[], numericColumns: string[]): number[][] {
  const n = numericColumns.length;
  const matrix: number[][] = Array(n)
    .fill(null)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        matrix[i][j] = pearsonCorrelation(data, numericColumns[i], numericColumns[j]);
      }
    }
  }

  return matrix;
}

function pearsonCorrelation(data: any[], col1: string, col2: string): number {
  const values1 = data.map((row) => parseFloat(row[col1])).filter((v) => !isNaN(v));
  const values2 = data.map((row) => parseFloat(row[col2])).filter((v) => !isNaN(v));

  if (values1.length !== values2.length || values1.length === 0) return 0;

  const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;

  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator === 0 ? 0 : numerator / denominator;
}

