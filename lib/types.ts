export type ColumnType = 'number' | 'date' | 'boolean' | 'category' | 'text';

export interface ColumnProfile {
  name: string;
  type: ColumnType;
  nullCount: number;
  uniqueCount: number;
  stats?: {
    // Numeric stats
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    // Categorical stats
    topValues?: Array<{ value: string; count: number }>;
    // Date stats
    minDate?: string;
    maxDate?: string;
    granularity?: 'day' | 'week' | 'month' | 'year';
  };
}

export interface Dataset {
  id: string;
  name: string;
  rows: any[][];
  columns: string[];
  columnProfiles: ColumnProfile[];
  rawData: any[];
  createdAt: number;
}

export interface TransformStep {
  id: string;
  type: 'dropNulls' | 'fillNulls' | 'trimText' | 'parseNumbers' | 'parseDates' | 'selectColumns';
  config: any;
}

export interface ChartConfig {
  id: string;
  datasetId: string;
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'histogram' | 'heatmap';
  xAxis: string;
  yAxis?: string;
  series?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  groupBy?: string;
  dateBucket?: 'day' | 'week' | 'month' | 'year';
  data: any[];
}

export interface Insight {
  type: 'missingness' | 'outlier' | 'correlation' | 'suggestion';
  message: string;
  severity?: 'low' | 'medium' | 'high';
  data?: any;
}

