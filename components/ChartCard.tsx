'use client';

import React, { useState } from 'react';
import { ChartConfig } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreVertical, Download, Copy, X } from 'lucide-react';
import { useStore } from '@/store/store';
import { downloadAsPNG } from '@/lib/utils';
import { ChartRenderer } from './ChartRenderer';
import { useToast } from '@/components/ui/use-toast';

interface ChartCardProps {
  chart: ChartConfig;
}

export function ChartCard({ chart }: ChartCardProps) {
  const { removeChart, updateChartTitle } = useStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chart.title);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (cardRef.current) {
      downloadAsPNG(cardRef.current, `${chart.title}.png`);
      toast({
        title: 'Chart downloaded',
        description: `${chart.title} saved as PNG`,
      });
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(chart, null, 2));
    toast({
      title: 'Config copied',
      description: 'Chart configuration copied to clipboard',
    });
  };

  const handleTitleSave = () => {
    updateChartTitle(chart.id, title);
    setIsEditing(false);
  };

  return (
    <Card ref={cardRef} className="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setTitle(chart.title);
                    setIsEditing(false);
                  }
                }}
                className="h-7 text-sm"
                autoFocus
              />
            </div>
          ) : (
            <CardTitle
              className="text-base font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {chart.title}
            </CardTitle>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyConfig}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Config JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => removeChart(chart.id)}
                className="text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <ChartRenderer chart={chart} />
      </CardContent>
    </Card>
  );
}

