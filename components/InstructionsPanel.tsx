'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Upload, BarChart3, Sparkles, FileText, Download, Copy } from 'lucide-react';

export function InstructionsPanel() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="glass mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            How to Use VizDrop
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">1. Upload Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop CSV or Excel files onto the dropzone, or click to browse. You can upload multiple files at once. For Excel files, each sheet will be loaded as a separate dataset.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">2. Explore Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Once uploaded, your datasets appear in the sidebar. Click on a dataset to view it in the data table. The app automatically detects column types (numbers, dates, categories, etc.) and shows data insights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">3. Create Visualizations</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Create charts in two ways:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li><strong>Quick Start:</strong> Click "Load Recommended" to auto-generate charts based on your data types</li>
                  <li><strong>Manual:</strong> Click "Create Chart" to build custom visualizations. Select chart type, columns, and aggregation options</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">4. Customize & Export</h3>
                <p className="text-sm text-muted-foreground">
                  Click on chart titles to rename them. Use the menu (⋮) on each chart to download as PNG or copy the chart configuration as JSON. Remove charts you don't need.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <h3 className="font-semibold mb-2 text-sm">Supported Chart Types</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• Bar Charts</div>
              <div>• Line Charts</div>
              <div>• Area Charts</div>
              <div>• Pie Charts</div>
              <div>• Scatter Plots</div>
              <div>• Histograms</div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>Privacy Note:</strong> All data processing happens in your browser. No files are uploaded to any server.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

