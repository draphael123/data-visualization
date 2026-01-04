'use client';

import React, { useState } from 'react';
import { Dataset, ChartConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { aggregateData, createHistogramData } from '@/lib/charts';
import { useStore } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';

interface ChartBuilderProps {
  dataset: Dataset;
  onClose?: () => void;
}

interface ChartBuilderProps {
  dataset: Dataset;
}

export function ChartBuilder({ dataset, onClose }: ChartBuilderProps) {
  const { addChart } = useStore();
  const { toast } = useToast();
  const [chartType, setChartType] = useState<ChartConfig['type']>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [aggregation, setAggregation] = useState<'sum' | 'avg' | 'count' | 'min' | 'max'>('sum');
  const [dateBucket, setDateBucket] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const numericCols = dataset.columnProfiles.filter((p) => p.type === 'number').map((p) => p.name);
  const categoryCols = dataset.columnProfiles.filter((p) => p.type === 'category').map((p) => p.name);
  const dateCols = dataset.columnProfiles.filter((p) => p.type === 'date').map((p) => p.name);
  const allCols = dataset.columns;

  const handleCreate = () => {
    if (!xAxis) {
      toast({
        title: 'Error',
        description: 'Please select an X-axis column',
        variant: 'destructive',
      });
      return;
    }

    let chartData: any[] = [];
    const chartTitle = title || `${chartType} chart`;

    switch (chartType) {
      case 'bar':
      case 'line':
      case 'area':
        if (!yAxis || yAxis === '__count__') {
          // If no Y-axis selected, use count aggregation with X-axis categories
          chartData = dataset.rawData.reduce((acc: any[], row) => {
            const key = String(row[xAxis] || '');
            const existing = acc.find((item) => item[xAxis] === key);
            if (existing) {
              existing.value = (existing.value || 0) + 1;
            } else {
              acc.push({ [xAxis]: key, value: 1 });
            }
            return acc;
          }, []);
        } else {
          chartData = aggregateData(dataset.rawData, xAxis, yAxis, aggregation, dateCols.includes(xAxis) ? dateBucket : undefined);
        }
        break;
      case 'pie':
        if (!yAxis || yAxis === '__count__') {
          // If no Y-axis selected, use count aggregation with X-axis categories
          chartData = dataset.rawData.reduce((acc: any[], row) => {
            const key = String(row[xAxis] || '');
            const existing = acc.find((item) => item[xAxis] === key);
            if (existing) {
              existing.value = (existing.value || 0) + 1;
            } else {
              acc.push({ [xAxis]: key, value: 1 });
            }
            return acc;
          }, []);
        } else {
          chartData = aggregateData(dataset.rawData, xAxis, yAxis, aggregation);
        }
        break;
      case 'scatter':
        if (!yAxis) {
          toast({
            title: 'Error',
            description: 'Scatter plots require both X and Y axes',
            variant: 'destructive',
          });
          return;
        }
        if (!numericCols.includes(yAxis) || !numericCols.includes(xAxis)) {
          toast({
            title: 'Error',
            description: 'Scatter plots require numeric columns for both axes',
            variant: 'destructive',
          });
          return;
        }
        chartData = dataset.rawData
          .filter((row) => {
            const x = parseFloat(row[xAxis]);
            const y = parseFloat(row[yAxis]);
            return !isNaN(x) && !isNaN(y);
          })
          .map((row) => ({
            x: parseFloat(row[xAxis]),
            y: parseFloat(row[yAxis]),
          }));
        break;
      case 'histogram':
        if (!numericCols.includes(xAxis)) {
          toast({
            title: 'Error',
            description: 'Please select a numeric column for histogram',
            variant: 'destructive',
          });
          return;
        }
        chartData = createHistogramData(dataset.rawData, xAxis);
        break;
    }

    const chart: ChartConfig = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      datasetId: dataset.id,
      title: chartTitle,
      type: chartType,
      xAxis,
      yAxis: chartType !== 'histogram' && yAxis !== '__count__' ? yAxis : undefined,
      aggregation: chartType !== 'scatter' && chartType !== 'histogram' ? aggregation : undefined,
      dateBucket: dateCols.includes(xAxis) ? dateBucket : undefined,
      data: chartData,
    };

    addChart(chart);
    toast({
      title: 'Chart created',
      description: `${chartTitle} added to dashboard`,
    });
    onClose?.();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Chart Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chart title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Chart Type</Label>
        <Select value={chartType} onValueChange={(value: ChartConfig['type']) => setChartType(value)}>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="scatter">Scatter Plot</SelectItem>
            <SelectItem value="histogram">Histogram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="xAxis">X-Axis</Label>
        <Select value={xAxis} onValueChange={setXAxis}>
          <SelectTrigger id="xAxis">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {allCols.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chartType !== 'histogram' && chartType !== 'scatter' && (
        <div className="space-y-2">
          <Label htmlFor="yAxis">Y-Axis (Optional)</Label>
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger id="yAxis">
              <SelectValue placeholder="Select column (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__count__">None (use count)</SelectItem>
              {numericCols.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Leave empty to count occurrences of each X-axis value
          </p>
        </div>
      )}
      
      {chartType === 'scatter' && (
        <div className="space-y-2">
          <Label htmlFor="yAxis">Y-Axis</Label>
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger id="yAxis">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {numericCols.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(chartType === 'bar' || chartType === 'line' || chartType === 'area' || chartType === 'pie') && (
        <div className="space-y-2">
          <Label htmlFor="aggregation">Aggregation</Label>
          <Select
            value={aggregation}
            onValueChange={(value: 'sum' | 'avg' | 'count' | 'min' | 'max') => setAggregation(value)}
          >
            <SelectTrigger id="aggregation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="avg">Average</SelectItem>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="min">Minimum</SelectItem>
              <SelectItem value="max">Maximum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {dateCols.includes(xAxis) && (
        <div className="space-y-2">
          <Label htmlFor="dateBucket">Date Bucket</Label>
          <Select
            value={dateBucket}
            onValueChange={(value: 'day' | 'week' | 'month' | 'year') => setDateBucket(value)}
          >
            <SelectTrigger id="dateBucket">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button onClick={handleCreate} className="w-full">
        Create Chart
      </Button>
    </div>
  );
}

