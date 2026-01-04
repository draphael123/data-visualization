'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dataset } from '@/lib/types';
import { FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface UploadPreviewProps {
  datasets: Dataset[];
  fileNames: string[];
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UploadPreview({ datasets, fileNames, isOpen, onConfirm, onCancel }: UploadPreviewProps) {
  const [previewRows, setPreviewRows] = useState(5);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview Upload</DialogTitle>
          <DialogDescription>
            Review the datasets that will be added. You can confirm or cancel this upload.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {datasets.map((dataset, index) => (
              <Card key={dataset.id} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{dataset.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">
                          {dataset.rawData.length.toLocaleString()} rows
                        </Badge>
                        <Badge variant="secondary">
                          {dataset.columns.length} columns
                        </Badge>
                        <Badge variant="outline">
                          {fileNames[index] || 'Unknown file'}
                        </Badge>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>

                  {/* Column preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Columns ({dataset.columns.length}):</h4>
                    <div className="flex flex-wrap gap-2">
                      {dataset.columns.slice(0, 10).map((col) => {
                        const profile = dataset.columnProfiles.find((p) => p.name === col);
                        return (
                          <Badge
                            key={col}
                            variant="outline"
                            className="text-xs"
                          >
                            {col}
                            <span className="ml-1 text-muted-foreground">
                              ({profile?.type || 'text'})
                            </span>
                          </Badge>
                        );
                      })}
                      {dataset.columns.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{dataset.columns.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Data preview table */}
                  <div className="border rounded-lg overflow-hidden">
                    <ScrollArea className="h-[200px]">
                      <div className="min-w-full">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 sticky top-0">
                            <tr>
                              {dataset.columns.slice(0, 8).map((col) => (
                                <th
                                  key={col}
                                  className="px-3 py-2 text-left font-semibold text-xs border-b"
                                >
                                  {col}
                                </th>
                              ))}
                              {dataset.columns.length > 8 && (
                                <th className="px-3 py-2 text-left font-semibold text-xs border-b">
                                  ...
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {dataset.rawData.slice(0, previewRows).map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className="border-b hover:bg-muted/30 transition-colors"
                              >
                                {dataset.columns.slice(0, 8).map((col) => {
                                  const value = row[col];
                                  return (
                                    <td
                                      key={col}
                                      className="px-3 py-2 text-xs max-w-[150px] truncate"
                                      title={String(value ?? '')}
                                    >
                                      {value !== null && value !== undefined
                                        ? String(value).length > 30
                                          ? String(value).substring(0, 30) + '...'
                                          : String(value)
                                        : (
                                            <span className="text-muted-foreground italic">null</span>
                                          )}
                                    </td>
                                  );
                                })}
                                {dataset.columns.length > 8 && (
                                  <td className="px-3 py-2 text-xs text-muted-foreground">
                                    ...
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                    {dataset.rawData.length > previewRows && (
                      <div className="px-3 py-2 bg-muted/30 text-xs text-center text-muted-foreground border-t">
                        Showing {previewRows} of {dataset.rawData.length.toLocaleString()} rows
                      </div>
                    )}
                  </div>

                  {/* Warnings */}
                  {dataset.rawData.length > 100000 && (
                    <div className="mt-3 flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        Large dataset detected. Performance may be impacted with {dataset.rawData.length.toLocaleString()} rows.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {datasets.length} dataset{datasets.length > 1 ? 's' : ''} ready to upload
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Confirm Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

