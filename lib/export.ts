import { Dataset, ChartConfig } from './types';

/**
 * Export dataset as CSV string
 */
export function exportDatasetToCSV(dataset: Dataset): string {
  if (dataset.rawData.length === 0) {
    return '';
  }

  // Get headers
  const headers = dataset.columns;
  
  // Create CSV rows
  const rows = dataset.rawData.map((row) => {
    return headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '';
      }
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
  });

  // Combine headers and rows
  const csvRows = [headers.join(','), ...rows.map((row) => row.join(','))];
  return csvRows.join('\n');
}

/**
 * Download dataset as CSV file
 */
export function downloadDatasetAsCSV(dataset: Dataset, filename?: string): void {
  const csv = exportDatasetToCSV(dataset);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `${dataset.name.replace(/\s+/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export chart configuration as JSON
 */
export function exportChartConfig(chart: ChartConfig): string {
  return JSON.stringify(chart, null, 2);
}

/**
 * Download chart configuration as JSON file
 */
export function downloadChartConfig(chart: ChartConfig, filename?: string): void {
  const json = exportChartConfig(chart);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `${chart.title.replace(/\s+/g, '_')}_config.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

