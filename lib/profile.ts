import { ColumnProfile, ColumnType } from './types';

export function inferType(values: any[]): ColumnType {
  const nonNullValues = values.filter((v) => v != null && v !== '');

  if (nonNullValues.length === 0) {
    return 'text';
  }

  // Check for boolean
  const booleanCount = nonNullValues.filter(
    (v) => typeof v === 'boolean' || v === 'true' || v === 'false' || v === 'TRUE' || v === 'FALSE'
  ).length;
  if (booleanCount / nonNullValues.length > 0.8) {
    return 'boolean';
  }

  // Check for date
  const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{4}\/\d{2}\/\d{2}/;
  const dateCount = nonNullValues.filter((v) => {
    if (typeof v === 'string') {
      return datePattern.test(v) || !isNaN(Date.parse(v));
    }
    return v instanceof Date;
  }).length;
  if (dateCount / nonNullValues.length > 0.7) {
    return 'date';
  }

  // Check for number
  const numericValues = nonNullValues.map((v) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const cleaned = v.replace(/,/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }).filter((v) => v !== null) as number[];

  if (numericValues.length / nonNullValues.length > 0.8) {
    return 'number';
  }

  // Check for category (low cardinality)
  const uniqueValues = new Set(nonNullValues.map(String));
  if (uniqueValues.size / nonNullValues.length < 0.5 && uniqueValues.size <= 20) {
    return 'category';
  }

  return 'text';
}

export function profileColumn(data: any[], columnName: string): ColumnProfile {
  const values = data.map((row) => row[columnName]);
  const type = inferType(values);
  const nullCount = values.filter((v) => v == null || v === '').length;
  const uniqueCount = new Set(values.filter((v) => v != null && v !== '').map(String)).size;

  const profile: ColumnProfile = {
    name: columnName,
    type,
    nullCount,
    uniqueCount,
  };

  const nonNullValues = values.filter((v) => v != null && v !== '');

  if (type === 'number') {
    const numericValues = nonNullValues.map((v) => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const cleaned = v.replace(/,/g, '');
        return parseFloat(cleaned);
      }
      return NaN;
    }).filter((v) => !isNaN(v)) as number[];

    if (numericValues.length > 0) {
      const sorted = [...numericValues].sort((a, b) => a - b);
      profile.stats = {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        median: sorted[Math.floor(sorted.length / 2)],
      };
    }
  } else if (type === 'category' || type === 'text') {
    const valueCounts = new Map<string, number>();
    nonNullValues.forEach((v) => {
      const key = String(v);
      valueCounts.set(key, (valueCounts.get(key) || 0) + 1);
    });

    const topValues = Array.from(valueCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    profile.stats = { topValues };
  } else if (type === 'date') {
    const dates = nonNullValues
      .map((v) => {
        if (v instanceof Date) return v;
        if (typeof v === 'string') {
          const parsed = new Date(v);
          return isNaN(parsed.getTime()) ? null : parsed;
        }
        return null;
      })
      .filter((v) => v !== null) as Date[];

    if (dates.length > 0) {
      const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
      const granularity = inferDateGranularity(dates);
      profile.stats = {
        minDate: sorted[0].toISOString(),
        maxDate: sorted[sorted.length - 1].toISOString(),
        granularity,
      };
    }
  }

  return profile;
}

export function profileDataset(data: any[], columns: string[]): ColumnProfile[] {
  return columns.map((col) => profileColumn(data, col));
}

function inferDateGranularity(dates: Date[]): 'day' | 'week' | 'month' | 'year' {
  if (dates.length < 2) return 'day';

  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const diffs: number[] = [];

  for (let i = 1; i < Math.min(sorted.length, 100); i++) {
    diffs.push(sorted[i].getTime() - sorted[i - 1].getTime());
  }

  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const days = avgDiff / (1000 * 60 * 60 * 24);

  if (days >= 365) return 'year';
  if (days >= 30) return 'month';
  if (days >= 7) return 'week';
  return 'day';
}

