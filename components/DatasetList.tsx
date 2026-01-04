'use client';

import React from 'react';
import { useStore } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Database, FileText } from 'lucide-react';
import { Dataset } from '@/lib/types';

interface DatasetListProps {
  onSelectDataset?: (dataset: Dataset) => void;
}

export function DatasetList({ onSelectDataset }: DatasetListProps) {
  const { datasets, activeDatasetId, setActiveDataset, removeDataset } = useStore();

  if (datasets.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No datasets loaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {datasets.map((dataset) => (
        <Card
          key={dataset.id}
          className={`glass cursor-pointer transition-all ${
            activeDatasetId === dataset.id
              ? 'border-primary ring-2 ring-primary/20'
              : 'hover:border-primary/50'
          }`}
          onClick={() => {
            setActiveDataset(dataset.id);
            onSelectDataset?.(dataset);
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
                <CardTitle className="text-sm font-medium truncate">
                  {dataset.name}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeDataset(dataset.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{dataset.rows.length.toLocaleString()} rows</span>
              <span>{dataset.columns.length} columns</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

