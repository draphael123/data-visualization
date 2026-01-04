import { describe, it, expect } from 'vitest';
import { inferType, profileColumn } from './profile';

describe('inferType', () => {
  it('should infer number type', () => {
    const values = [1, 2, 3, 4, 5];
    expect(inferType(values)).toBe('number');
  });

  it('should infer number type from strings', () => {
    const values = ['1', '2', '3.5', '4', '5'];
    expect(inferType(values)).toBe('number');
  });

  it('should infer date type', () => {
    const values = ['2024-01-01', '2024-01-02', '2024-01-03'];
    expect(inferType(values)).toBe('date');
  });

  it('should infer boolean type', () => {
    const values = [true, false, true, false];
    expect(inferType(values)).toBe('boolean');
  });

  it('should infer category type for low cardinality', () => {
    const values = ['A', 'B', 'A', 'B', 'A', 'C'];
    expect(inferType(values)).toBe('category');
  });

  it('should infer text type as fallback', () => {
    const values = ['hello', 'world', 'test', 'data'];
    expect(inferType(values)).toBe('text');
  });
});

describe('profileColumn', () => {
  it('should profile numeric column', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];
    const profile = profileColumn(data, 'value');
    expect(profile.type).toBe('number');
    expect(profile.stats?.min).toBe(1);
    expect(profile.stats?.max).toBe(5);
    expect(profile.stats?.mean).toBe(3);
  });

  it('should profile categorical column', () => {
    const data = [
      { category: 'A' },
      { category: 'B' },
      { category: 'A' },
      { category: 'C' },
    ];
    const profile = profileColumn(data, 'category');
    expect(profile.type).toBe('category');
    expect(profile.stats?.topValues).toBeDefined();
    expect(profile.stats?.topValues?.length).toBeGreaterThan(0);
  });

  it('should count nulls', () => {
    const data = [
      { value: 1 },
      { value: null },
      { value: 2 },
      { value: '' },
    ];
    const profile = profileColumn(data, 'value');
    expect(profile.nullCount).toBe(2);
  });
});

