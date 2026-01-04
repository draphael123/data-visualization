'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import { Save, Folder, Trash2, Download, X } from 'lucide-react';
import { downloadDatasetAsCSV } from '@/lib/export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProjectManager() {
  const { projects, saveProject, loadProject, deleteProject, clearCurrentProject, datasets, charts } = useStore();
  const { toast } = useToast();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!projectName.trim()) {
      toast({
        title: 'Project name required',
        description: 'Please enter a name for your project',
        variant: 'destructive',
      });
      return;
    }

    if (datasets.length === 0) {
      toast({
        title: 'No data to save',
        description: 'Please upload at least one dataset before saving',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const projectId = saveProject(projectName.trim());
      toast({
        title: 'Project saved',
        description: `"${projectName}" has been saved successfully`,
      });
      setProjectName('');
      setIsSaveDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error saving project',
        description: error.message || 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (projectId: string) => {
    try {
      loadProject(projectId);
      const project = projects.find((p) => p.id === projectId);
      toast({
        title: 'Project loaded',
        description: `"${project?.name}" has been loaded`,
      });
    } catch (error: any) {
      toast({
        title: 'Error loading project',
        description: error.message || 'Failed to load project',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (projectId: string, projectName: string) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      deleteProject(projectId);
      toast({
        title: 'Project deleted',
        description: `"${projectName}" has been deleted`,
      });
    }
  };

  const handleClear = () => {
    if (datasets.length > 0 || charts.length > 0) {
      if (confirm('Clear all datasets and charts? This will not delete saved projects.')) {
        clearCurrentProject();
        toast({
          title: 'Workspace cleared',
          description: 'All datasets and charts have been removed',
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Project</DialogTitle>
              <DialogDescription>
                Save your current datasets and charts as a project for later use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Data Analysis"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>This project contains:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>{datasets.length} dataset{datasets.length !== 1 ? 's' : ''}</li>
                  <li>{charts.length} chart{charts.length !== 1 ? 's' : ''}</li>
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading || !projectName.trim()}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {(datasets.length > 0 || charts.length > 0) && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {projects.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Saved Projects ({projects.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projects.map((project) => (
              <Card key={project.id} className="glass">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">{project.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {project.datasets.length} dataset{project.datasets.length !== 1 ? 's' : ''}, {project.charts.length} chart{project.charts.length !== 1 ? 's' : ''}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleLoad(project.id)}>
                          <Folder className="h-4 w-4 mr-2" />
                          Load
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project.id, project.name)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {datasets.length > 0 && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold mb-3">Export Data</h3>
          <div className="space-y-2">
            {datasets.map((dataset) => (
              <Button
                key={dataset.id}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => downloadDatasetAsCSV(dataset)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export {dataset.name} as CSV
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

