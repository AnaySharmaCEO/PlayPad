import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Mic, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from './TaskModal';

interface AIPromptBoxProps {
  onGenerateSchedule: (prompt: string) => void;
  isGenerating: boolean;
}

export const AIPromptBox: React.FC<AIPromptBoxProps> = ({
  onGenerateSchedule,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleGenerateSchedule = () => {
    if (prompt.trim()) {
      onGenerateSchedule(prompt.trim());
    }
  };

  const handleClearInput = () => {
    setPrompt('');
  };

  const handleVoiceInput = () => {
    // UI-only voice input button
    setIsListening(!isListening);
    // Simulate voice input (placeholder)
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setPrompt(prev => prev + (prev ? ' ' : '') + 'Finish assignment by 5pm, workout at 7am, study Java for 2 hours');
      }, 2000);
    }
  };

  const examplePrompts = [
    "Finish assignment by 5pm, workout at 7am, study Java for 2 hours",
    "Meeting with team at 10am, lunch with client at 12pm, gym session at 6pm",
    "Study session 2-4pm, grocery shopping at 5pm, dinner with family at 7pm",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-xl border-border/50 bg-gradient-to-br from-background to-card/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            AI Schedule Generator
            <Badge variant="secondary" className="ml-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              Beta
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe your tasks and goals, and I'll create a smart schedule for you
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your tasks, goals, and deadlines (e.g., Finish assignment by 5pm, workout at 7am, study Java for 2 hours)..."
              className="min-h-24 rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              disabled={isGenerating}
            />
            
            {/* Example prompts */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Try these examples:</span>
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                >
                  "{example.slice(0, 30)}..."
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div className="flex-1">
              <Button
                onClick={handleGenerateSchedule}
                disabled={!prompt.trim() || isGenerating}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300 hover:shadow-lg"
                size="lg"
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Schedule...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Schedule
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleClearInput}
              disabled={!prompt || isGenerating}
              className="rounded-xl aspect-square p-0 transition-all duration-200 hover:bg-destructive/10 hover:border-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <motion.div
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleVoiceInput}
                disabled={isGenerating}
                className={`rounded-xl aspect-square p-0 transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                    : 'hover:bg-blue-500/10 hover:border-blue-500'
                }`}
              >
                <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
            </motion.div>
          </div>

          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-red-500/10 rounded-xl border border-red-500/20"
            >
              <div className="flex items-center text-red-600">
                <Mic className="h-4 w-4 mr-2 animate-pulse" />
                <span className="text-sm">Listening... Speak your schedule requirements</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};