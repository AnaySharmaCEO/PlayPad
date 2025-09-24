import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, Minus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CaptionBoxProps {
  text: string;
  type: 'user' | 'ai' | 'none';
}

export const CaptionBox: React.FC<CaptionBoxProps> = ({ text, type }) => {
  const [fontSize, setFontSize] = useState(24);
  const [isVisible, setIsVisible] = useState(true);
  const [animatedText, setAnimatedText] = useState('');

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 4, 48));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 4, 16));
  };

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // Animate text word by word
  useEffect(() => {
    if (!text) {
      setAnimatedText('');
      return;
    }

    const words = text.split(' ');
    let currentIndex = 0;
    setAnimatedText('');

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setAnimatedText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  if (!isVisible) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleVisibility}
          className="border border-border bg-background/90 backdrop-blur-sm hover:border-foreground transition-all duration-200"
          aria-label="Show captions"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 max-w-4xl w-full px-4"
    >
      <div className="bg-background/95 backdrop-blur-lg border-2 border-border p-6 shadow-lg">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium px-2 py-1 border ${
                type === 'user' 
                  ? 'border-foreground bg-foreground text-background' 
                  : type === 'ai' 
                  ? 'border-muted-foreground bg-muted text-foreground'
                  : 'border-border bg-secondary text-muted-foreground'
              }`}
            >
              {type === 'user' ? 'You' : type === 'ai' ? 'AI' : 'System'}
            </motion.span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={decreaseFontSize}
              className="h-8 w-8 p-0 border border-border hover:border-foreground"
              disabled={fontSize <= 16}
              aria-label="Decrease font size"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground min-w-12 text-center font-medium">
              {fontSize}px
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={increaseFontSize}
              className="h-8 w-8 p-0 border border-border hover:border-foreground"
              disabled={fontSize >= 48}
              aria-label="Increase font size"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="h-8 w-8 p-0 border border-border hover:border-foreground"
              aria-label="Hide captions"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Caption Text */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={animatedText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-foreground font-medium leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              {animatedText || (type === 'none' ? 'Ready to assist...' : 'Listening...')}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};