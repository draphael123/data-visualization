'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I upload my data?',
        a: 'Simply drag and drop your CSV or Excel files onto the dropzone on the homepage, or click to browse and select files. You can upload multiple files at once. Excel files with multiple sheets will be loaded as separate datasets.',
      },
      {
        q: 'What file formats are supported?',
        a: 'VizDrop supports CSV files and Excel files (.xlsx, .xls). For CSV files, the first row should contain column headers. Excel files can have multiple sheets, and each sheet will be loaded as a separate dataset.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes! All data processing happens entirely in your browser. Your files are never uploaded to any server, ensuring complete privacy and security for sensitive data.',
      },
      {
        q: 'Can I use VizDrop offline?',
        a: 'Yes, once the website is loaded, VizDrop works offline. All processing happens locally in your browser, so you don\'t need an internet connection after the initial page load.',
      },
    ],
  },
  {
    category: 'Creating Visualizations',
    questions: [
      {
        q: 'How do I create a chart?',
        a: 'There are two ways: (1) Click "Load Recommended" to automatically generate charts based on your data types, or (2) Click "Create Chart" to manually build a chart by selecting chart type, columns, and aggregation options.',
      },
      {
        q: 'What chart types are available?',
        a: 'VizDrop supports Bar Charts, Line Charts, Area Charts, Pie Charts, Scatter Plots, and Histograms. Each chart type is automatically recommended based on your data structure.',
      },
      {
        q: 'Do I need both X and Y axes?',
        a: 'For most charts, you only need an X-axis. If no Y-axis is selected, the chart will count occurrences of each X-axis value. Scatter plots require both X and Y axes. Histograms only need an X-axis (numeric column).',
      },
      {
        q: 'How do I edit a chart title?',
        a: 'Click on the chart title in the chart card to edit it inline. Press Enter to save or Escape to cancel.',
      },
      {
        q: 'Can I download my charts?',
        a: 'Yes! Click the menu (⋮) on any chart card and select "Download PNG" to save the chart as an image file.',
      },
    ],
  },
  {
    category: 'Working with Data',
    questions: [
      {
        q: 'How do I view my raw data?',
        a: 'Click on the "Data Table" tab in the dashboard to view your data in an interactive table. You can search, sort, and navigate through the data.',
      },
      {
        q: 'Can I export my data?',
        a: 'Yes! In the Projects section of the dashboard sidebar, you can export any dataset as a CSV file. Your data remains in the browser and can be exported at any time.',
      },
      {
        q: 'How do I save my work?',
        a: 'Use the "Save Project" button in the Projects section of the sidebar. Your datasets and charts will be saved to your browser\'s local storage. You can load saved projects later.',
      },
      {
        q: 'What happens if I refresh the page?',
        a: 'Your current working session will be cleared, but any saved projects will remain. Make sure to save your work as a project before refreshing if you want to keep it.',
      },
      {
        q: 'Is there a limit on file size?',
        a: 'While there\'s no hard limit, very large files (>100k rows) may cause performance issues. A warning is displayed for large datasets. For best performance, consider using datasets with fewer than 100,000 rows.',
      },
    ],
  },
  {
    category: 'Projects & Data Management',
    questions: [
      {
        q: 'What are projects?',
        a: 'Projects allow you to save your current datasets and charts with a name, so you can return to them later. Projects are stored in your browser\'s local storage.',
      },
      {
        q: 'How many projects can I save?',
        a: 'Projects are stored in your browser\'s local storage, which typically has a limit of 5-10MB. The exact number depends on the size of your datasets. You\'ll see a warning if storage is running low.',
      },
      {
        q: 'Can I share projects with others?',
        a: 'Projects are stored locally in your browser and cannot be directly shared. However, you can export your datasets as CSV files and share those, or export chart configurations as JSON.',
      },
      {
        q: 'How do I delete a project?',
        a: 'In the Projects section, click the menu (⋮) on any saved project and select "Delete". This action cannot be undone.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        q: 'My file won\'t upload. What should I do?',
        a: 'Check that your file is in CSV or Excel format (.csv, .xlsx, .xls). Ensure the file has headers in the first row. For CSV files, make sure the encoding is UTF-8. Try a smaller file if you\'re experiencing issues.',
      },
      {
        q: 'The chart looks wrong. How do I fix it?',
        a: 'Check that you\'ve selected the correct columns for your chart type. For numeric charts, ensure your data columns contain numeric values. You can recreate the chart with different settings using the "Create Chart" button.',
      },
      {
        q: 'My browser is running slowly.',
        a: 'Large datasets can impact browser performance. Try using smaller datasets, close other browser tabs, or clear your browser cache. Consider exporting and working with subsets of your data.',
      },
      {
        q: 'I lost my data after refreshing.',
        a: 'Make sure to save your work as a project before refreshing the page. Projects are preserved across browser sessions, but the current working session is not automatically saved.',
      },
    ],
  },
];

export default function FAQPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative flex flex-col">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 py-8 flex-1">
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
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center justify-center gap-3"
            >
              <HelpCircle className="h-10 w-10 md:h-12 md:w-12" />
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Find answers to common questions about using VizDrop
            </motion.p>
          </div>

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="glass-strong">
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left font-semibold">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-strong mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Get in touch with us!
              </p>
              <Button onClick={() => router.push('/contact')}>
                Contact Us
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

