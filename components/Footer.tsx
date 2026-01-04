'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Github, Mail, Send } from 'lucide-react';

export function Footer() {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd send this to a backend API
    // For now, we'll just show a toast and clear the form
    toast({
      title: 'Thank you for your suggestion!',
      description: 'We appreciate your feedback and will consider it for future updates.',
    });

    // Clear form
    setSuggestion('');
    setEmail('');
    setIsSuggestionsOpen(false);
  };

  return (
    <>
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                VizDrop
              </h3>
              <p className="text-sm text-muted-foreground">
                Transform your data into beautiful, interactive visualizations instantly. 
                All processing happens in your browser for complete privacy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Feedback</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have suggestions or feedback? We'd love to hear from you!
              </p>
              <Button
                onClick={() => setIsSuggestionsOpen(true)}
                variant="outline"
                size="sm"
                className="w-full mb-2"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Suggestion
              </Button>
              <Button
                onClick={() => window.location.href = '/contact'}
                variant="default"
                size="sm"
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Form
              </Button>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} VizDrop. Built with Next.js and privacy in mind.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Us Your Suggestions</DialogTitle>
            <DialogDescription>
              We value your feedback! Share your ideas, report bugs, or suggest new features.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitSuggestion} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave your email if you'd like us to follow up on your suggestion.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suggestion">Your Suggestion</Label>
              <Textarea
                id="suggestion"
                placeholder="Tell us what you think... What features would you like to see? Any bugs you've encountered? General feedback?"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                rows={6}
                required
                className="resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSuggestionsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!suggestion.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Suggestion
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

