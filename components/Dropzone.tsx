'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseCSV, parseExcel } from '@/lib/parse';
import { useStore } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';

export function Dropzone() {
  const { addDataset } = useStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setProgress('Processing files...');

    try {
      for (const file of acceptedFiles) {
        setProgress(`Processing ${file.name}...`);

        if (file.name.endsWith('.csv')) {
          const dataset = await parseCSV(file, file.name);
          addDataset(dataset);
          toast({
            title: 'File uploaded',
            description: `${file.name} processed successfully`,
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const datasets = await parseExcel(file);
          datasets.forEach((ds) => addDataset(ds));
          toast({
            title: 'File uploaded',
            description: `${file.name} processed successfully (${datasets.length} sheet${datasets.length > 1 ? 's' : ''})`,
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error processing file',
        description: error.message || 'Failed to process file',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  }, [addDataset, toast]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: true,
  });

  return (
    <Card className="glass p-8 border-2 border-dashed transition-all hover:border-primary/50">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              or click to browse (CSV, Excel)
            </p>
          </div>
          {isProcessing && (
            <p className="text-sm text-muted-foreground">{progress}</p>
          )}
        </div>
      </div>
      {acceptedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {acceptedFiles.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

