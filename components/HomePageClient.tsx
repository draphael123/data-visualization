'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dropzone } from '@/components/Dropzone';
import { InstructionsPanel } from '@/components/InstructionsPanel';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileSpreadsheet, BarChart3, Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import { useStore } from '@/store/store';
import { parseCSV } from '@/lib/parse';
import { useToast } from '@/components/ui/use-toast';

export default function HomePageClient() {
  const router = useRouter();
  const { addDataset, datasets } = useStore();
  const { toast } = useToast();

  const handleSampleDataset = async () => {
    try {
      const response = await fetch('/samples/sample.csv');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const file = new File([blob], 'sample.csv', { type: 'text/csv' });
      const dataset = await parseCSV(file, 'Sample Dataset');
      addDataset(dataset);
      toast({
        title: 'Sample dataset loaded',
        description: 'Navigate to dashboard to view visualizations',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error loading sample',
        description: error.message || 'Failed to load sample dataset',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text">VizDrop</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThemeToggle />
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
            >
              Visualize Your Data Instantly
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Drag and drop CSV or Excel files to create beautiful, interactive visualizations. No uploads, no servers—everything runs in your browser.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <InstructionsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-8"
          >
            <Dropzone />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSampleDataset}
                variant="outline"
                size="lg"
                className="glass shine group"
              >
                <FileSpreadsheet className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Try Sample Dataset
              </Button>
            </motion.div>
            {datasets.length > 0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="animate-pulse-glow"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="glass-strong shine h-full group cursor-pointer border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="inline-block"
                  >
                    <FileSpreadsheet className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors">Multiple Formats</CardTitle>
                  <CardDescription>
                    Support for CSV and Excel files (XLSX)
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="glass-strong shine h-full group cursor-pointer border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    <BarChart3 className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors">Smart Visualizations</CardTitle>
                  <CardDescription>
                    Auto-generate charts based on your data types
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="glass-strong shine h-full group cursor-pointer border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                    className="inline-block"
                  >
                    <Shield className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors">Private & Fast</CardTitle>
                  <CardDescription>
                    Everything runs locally in your browser
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

