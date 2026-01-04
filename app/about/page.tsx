'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ArrowLeft, Sparkles, FileSpreadsheet, BarChart3, Shield, Zap, Lock } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
              Home
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
            >
              About VizDrop
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Transforming raw data into beautiful, interactive visualizations instantly
            </motion.p>
          </div>

          <Card className="glass-strong mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Purpose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>VizDrop</strong> is a modern, browser-based data visualization tool designed to make data analysis accessible, fast, and privacy-focused. 
                Our primary goal is to empower users to quickly transform their CSV and Excel files into meaningful, interactive visualizations without the need for complex software installations or cloud uploads.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a data analyst exploring datasets, a student working on projects, a business professional preparing reports, or anyone who needs to understand their data better, 
                VizDrop provides an intuitive platform to visualize information instantly.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Instant Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload your data files and get immediate insights. Our intelligent system automatically detects data types, suggests appropriate visualizations, and generates charts in seconds—no configuration needed.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Complete Privacy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your data never leaves your browser. All processing happens locally on your device, ensuring complete privacy and security. Perfect for sensitive data that cannot be uploaded to cloud services.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Easy to Use</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No learning curve required. Simply drag and drop your files, explore your data, and create beautiful visualizations with our intuitive interface. Works with CSV and Excel formats out of the box.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Flexible Visualization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create bar charts, line graphs, pie charts, scatter plots, histograms, and more. Customize your visualizations, export them as images, or use our recommended charts to get started instantly.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-2xl">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Multi-format support:</strong> Upload CSV and Excel (XLSX) files, including multiple sheets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Smart data profiling:</strong> Automatic type detection, statistics, and data quality insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Auto-generated charts:</strong> Get recommended visualizations based on your data structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Interactive data table:</strong> Search, sort, filter, and explore your data in detail</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Export capabilities:</strong> Download charts as PNG images or copy configurations as JSON</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Dark mode support:</strong> Comfortable viewing in any lighting condition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Zero dependencies:</strong> No accounts, no installations, no subscriptions—just open and use</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button onClick={() => router.push('/')} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

