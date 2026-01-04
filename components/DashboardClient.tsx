'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { DatasetList } from '@/components/DatasetList';
import { ChartGrid } from '@/components/ChartGrid';
import { InsightsPanel } from '@/components/InsightsPanel';
import { DataTable } from '@/components/DataTable';
import { InstructionsPanel } from '@/components/InstructionsPanel';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Sparkles, Plus } from 'lucide-react';
import { recommendCharts } from '@/lib/charts';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChartBuilder } from '@/components/ChartBuilder';

export default function DashboardClient() {
  const router = useRouter();
  const { datasets, activeDatasetId, charts, addChart, setActiveDataset } = useStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const activeDataset = datasets.find((d) => d.id === activeDatasetId);

  useEffect(() => {
    if (datasets.length === 0) {
      router.push('/');
    }
  }, [datasets.length, router]);

  const handleLoadRecommended = () => {
    if (!activeDataset) return;
    const recommendations = recommendCharts(activeDataset);
    recommendations.forEach((chart) => addChart(chart));
    toast({
      title: 'Recommended charts added',
      description: `Added ${recommendations.length} chart${recommendations.length > 1 ? 's' : ''}`,
    });
  };

  if (datasets.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-6 relative">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Chart
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Chart</DialogTitle>
                  <DialogDescription>
                    Configure your chart settings and data selection
                  </DialogDescription>
                </DialogHeader>
                {activeDataset && (
                  <ChartBuilder
                    dataset={activeDataset}
                    onClose={() => setIsDialogOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
            {activeDataset && (
              <Button onClick={handleLoadRecommended} variant="outline">
                Load Recommended
              </Button>
            )}
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Datasets</h2>
              <DatasetList
                onSelectDataset={(dataset) => {
                  setActiveDataset(dataset.id);
                }}
              />
            </div>
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            <InstructionsPanel />
            <Tabs defaultValue="charts" className="w-full mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="table">Data Table</TabsTrigger>
              </TabsList>
              <TabsContent value="charts" className="space-y-4">
                {activeDataset ? (
                  <ChartGrid />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Select a dataset to view charts
                  </div>
                )}
              </TabsContent>
              <TabsContent value="table" className="space-y-4">
                {activeDataset ? (
                  <DataTable dataset={activeDataset} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Select a dataset to view data table
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.main>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Insights</h2>
              <InsightsPanel />
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

