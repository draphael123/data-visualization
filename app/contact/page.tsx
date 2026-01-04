'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Sparkles, Mail, Send, MessageSquare, User, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real application, you would send this to a backend API
      // For now, we'll simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Message sent successfully!',
        description: 'Thank you for contacting us. We\'ll get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Have questions, feedback, or need support? We'd love to hear from you!
            </motion.p>
          </div>

          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Contact Us
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief subject line"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={8}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Please provide as much detail as possible so we can assist you better.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    <span className="text-destructive">*</span> Required fields
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card className="glass text-center">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  For general inquiries and support
                </p>
              </CardContent>
            </Card>

            <Card className="glass text-center">
              <CardContent className="pt-6">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours
                </p>
              </CardContent>
            </Card>

            <Card className="glass text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Check our About page for usage guides
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

