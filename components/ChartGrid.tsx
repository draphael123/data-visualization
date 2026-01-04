'use client';

import React from 'react';
import { useStore } from '@/store/store';
import { ChartCard } from './ChartCard';

export function ChartGrid() {
  const { charts } = useStore();

  if (charts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <p className="text-lg font-semibold mb-2">No charts yet</p>
          <p className="text-sm text-muted-foreground">
            Create a chart using the chart builder or add a recommended chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {charts.map((chart) => (
        <ChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  );
}

