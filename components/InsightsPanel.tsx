'use client';

import React from 'react';
import { useStore } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dataset, Insight } from '@/lib/types';
import { AlertTriangle, TrendingUp, Lightbulb, Info } from 'lucide-react';
import { computeCorrelations } from '@/lib/charts';

export function InsightsPanel() {
  const { datasets, activeDatasetId } = useStore();
  const activeDataset = datasets.find((d) => d.id === activeDatasetId);

  if (!activeDataset) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a dataset to view insights</p>
        </CardContent>
      </Card>
    );
  }

  const insights: Insight[] = [];

  // Missingness insights
  activeDataset.columnProfiles.forEach((profile) => {
    const missingPercent = (profile.nullCount / activeDataset.rows.length) * 100;
    if (missingPercent > 10) {
      insights.push({
        type: 'missingness',
        message: `${profile.name}: ${missingPercent.toFixed(1)}% missing values`,
        severity: missingPercent > 50 ? 'high' : missingPercent > 25 ? 'medium' : 'low',
        data: { column: profile.name, percent: missingPercent },
      });
    }
  });

  // Outlier insights
  activeDataset.columnProfiles
    .filter((p) => p.type === 'number' && p.stats)
    .forEach((profile) => {
      const stats = profile.stats!;
      const iqr = (stats.max! - stats.min!) * 0.25;
      const q1 = stats.min! + iqr;
      const q3 = stats.max! - iqr;
      const outlierThreshold = q3 + 1.5 * iqr;

      // Simple check - count potential outliers (values > Q3 + 1.5*IQR)
      const potentialOutliers = activeDataset.rawData.filter((row) => {
        const value = parseFloat(row[profile.name]);
        return !isNaN(value) && value > outlierThreshold;
      }).length;

      if (potentialOutliers > 0) {
        const outlierPercent = (potentialOutliers / activeDataset.rows.length) * 100;
        insights.push({
          type: 'outlier',
          message: `${profile.name}: ${potentialOutliers} potential outliers (${outlierPercent.toFixed(1)}%)`,
          severity: outlierPercent > 5 ? 'medium' : 'low',
          data: { column: profile.name, count: potentialOutliers },
        });
      }
    });

  // Correlation insights
  const numericColumns = activeDataset.columnProfiles
    .filter((p) => p.type === 'number')
    .map((p) => p.name);

  if (numericColumns.length >= 2) {
    const correlations = computeCorrelations(activeDataset.rawData, numericColumns);
    const strongCorrelations: Array<{ col1: string; col2: string; value: number }> = [];

    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const corr = Math.abs(correlations[i][j]);
        if (corr > 0.7) {
          strongCorrelations.push({
            col1: numericColumns[i],
            col2: numericColumns[j],
            value: correlations[i][j],
          });
        }
      }
    }

    strongCorrelations.slice(0, 3).forEach(({ col1, col2, value }) => {
      insights.push({
        type: 'correlation',
        message: `${col1} & ${col2}: ${value > 0 ? 'strong positive' : 'strong negative'} correlation (${value.toFixed(2)})`,
        severity: 'low',
        data: { col1, col2, value },
      });
    });
  }

  if (insights.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No insights to display</p>
          <p className="text-xs mt-2">Your data looks good!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <Card key={index} className="glass">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {insight.type === 'missingness' && (
                <AlertTriangle
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    insight.severity === 'high'
                      ? 'text-destructive'
                      : insight.severity === 'medium'
                      ? 'text-yellow-500'
                      : 'text-muted-foreground'
                  }`}
                />
              )}
              {insight.type === 'correlation' && (
                <TrendingUp className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
              )}
              {insight.type === 'outlier' && (
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-yellow-500" />
              )}
              {insight.type === 'suggestion' && (
                <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
              )}
              <p className="text-sm flex-1">{insight.message}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

