import { describe, it, expect } from 'vitest';
import { aggregateData, createHistogramData, computeCorrelations } from './charts';

describe('aggregateData', () => {
  it('should aggregate by sum', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'A', value: 20 },
      { category: 'B', value: 15 },
    ];
    const result = aggregateData(data, 'category', 'value', 'sum');
    expect(result).toHaveLength(2);
    const aGroup = result.find((r) => r.category === 'A');
    expect(aGroup?.value).toBe(30);
  });

  it('should aggregate by average', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'A', value: 20 },
    ];
    const result = aggregateData(data, 'category', 'value', 'avg');
    const aGroup = result.find((r) => r.category === 'A');
    expect(aGroup?.value).toBe(15);
  });

  it('should aggregate by count', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'A', value: 20 },
      { category: 'B', value: 15 },
    ];
    const result = aggregateData(data, 'category', 'value', 'count');
    const aGroup = result.find((r) => r.category === 'A');
    expect(aGroup?.value).toBe(2);
  });
});

describe('createHistogramData', () => {
  it('should create histogram bins', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];
    const result = createHistogramData(data, 'value', 5);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('bin');
    expect(result[0]).toHaveProperty('count');
  });
});

describe('computeCorrelations', () => {
  it('should compute correlation matrix', () => {
    const data = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    const result = computeCorrelations(data, ['x', 'y']);
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe(1); // self-correlation
    expect(result[1][1]).toBe(1); // self-correlation
    // Perfect positive correlation
    expect(result[0][1]).toBeCloseTo(1, 2);
  });
});

