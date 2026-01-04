'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseCSV, parseExcel } from '@/lib/parse';
import { useStore } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import { UploadPreview } from '@/components/UploadPreview';
import { Dataset } from '@/lib/types';

export function Dropzone() {
  const { addDataset } = useStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [previewDatasets, setPreviewDatasets] = useState<Dataset[]>([]);
  const [previewFileNames, setPreviewFileNames] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setProgress('Processing files...');

    try {
      const parsedDatasets: Dataset[] = [];
      const fileNames: string[] = [];

      for (const file of acceptedFiles) {
        setProgress(`Processing ${file.name}...`);

        if (file.name.endsWith('.csv')) {
          const dataset = await parseCSV(file, file.name);
          parsedDatasets.push(dataset);
          fileNames.push(file.name);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const datasets = await parseExcel(file);
          parsedDatasets.push(...datasets);
          // For Excel files with multiple sheets, use the filename for each
          datasets.forEach(() => fileNames.push(file.name));
        }
      }

      // Show preview instead of directly adding
      if (parsedDatasets.length > 0) {
        setPreviewDatasets(parsedDatasets);
        setPreviewFileNames(fileNames);
        setShowPreview(true);
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
  }, [toast]);

  const handleConfirmUpload = useCallback(() => {
    previewDatasets.forEach((dataset) => {
      addDataset(dataset);
    });
    
    toast({
      title: 'Files uploaded',
      description: `${previewDatasets.length} dataset${previewDatasets.length > 1 ? 's' : ''} added successfully`,
    });

    setShowPreview(false);
    setPreviewDatasets([]);
    setPreviewFileNames([]);
  }, [previewDatasets, addDataset, toast]);

  const handleCancelUpload = useCallback(() => {
    setShowPreview(false);
    setPreviewDatasets([]);
    setPreviewFileNames([]);
  }, []);

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
    <Card className="glass-strong p-8 border-2 border-dashed transition-all hover:border-primary/50 hover:shadow-xl group">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={isDragActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
            className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors"
          >
            <Upload className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
          </motion.div>
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

