import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// This is a comment to trigger a change

interface NavigationProps {
  currentMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { id: 'playpad', label: 'Playground', icon: '🧪' },
    { id: 'contact', label: 'Contact', icon: '💬' },
    { id: 'pricing', label: 'Pricing', icon: '💸' },
    { id: 'signin', label: 'Sign In', icon: '🔐' },
    { id: 'newsletter', label: 'Newsletter', icon: '📬' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'playpad') {
      onModeChange('playpad');
    } else if (id === 'signin') {
      onModeChange('signin');
    } else if (id === 'pricing') {
      // Scroll to pricing section on home page
      if (currentMode !== 'home') {
        onModeChange('home');
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (id === 'newsletter') {
      // Scroll to newsletter section on home page
      if (currentMode !== 'home') {
        onModeChange('home');
        setTimeout(() => {
          document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle other navigation items (placeholder functionality)
      console.log(`Navigate to ${id}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-all duration-300 hidden md:block ${
          scrolled 
            ? 'bg-background/95 border-border shadow-lg' 
            : 'bg-background/80 border-border/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Home Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onModeChange('home')}
                className={`border hover:border-foreground transition-all duration-300 ${
                  currentMode === 'home' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'border-border hover:bg-muted'
                }`}
                aria-label="Home"
              >
                PlayPad AI
              </Button>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navigationLinks.map(({ id, label }) => (
                <motion.div key={id} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavClick(id)}
                    className={`transition-all duration-300 ${
                      currentMode === id 
                        ? 'border-b-2 border-foreground rounded-none' 
                        : 'hover:border-b-2 hover:border-muted-foreground hover:rounded-none'
                    }`}
                    aria-label={label}
                  >
                    {label}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="border border-border hover:border-foreground transition-all duration-300"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-all duration-300 md:hidden ${
          scrolled 
            ? 'bg-background/95 border-border shadow-lg' 
            : 'bg-background/80 border-border/30'
        }`}
      >
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Home Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onModeChange('home')}
                className={`border hover:border-foreground transition-all duration-300 ${
                  currentMode === 'home' 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'border-border hover:bg-muted'
                }`}
                aria-label="Home"
              >
                PlayPad AI
              </Button>
            </motion.div>

            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="border border-border hover:border-foreground transition-all duration-300"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="border border-border hover:border-foreground transition-all duration-300"
                  aria-label="Toggle mobile menu"
                >
                  <motion.div
                    key={mobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mobileMenuOpen ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Menu className="h-4 w-4" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border bg-background/95 backdrop-blur-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationLinks.map(({ id, label }) => (
                  <Button
                    key={id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavClick(id)}
                    className={`w-full justify-start transition-all duration-300 ${
                      currentMode === id 
                        ? 'bg-foreground text-background' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};