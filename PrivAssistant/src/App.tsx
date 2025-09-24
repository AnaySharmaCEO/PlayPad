import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navigation, NavigationMode } from './components/Navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { PlaygroundInterface } from './components/PlaygroundInterface';
import { VoiceInterface } from './components/VoiceInterface';
import { TextInterface } from './components/TextInterface';
import { HomePage } from './pages/HomePage';
import { PlaypadPage } from './pages/PlaypadPage';
import { SchedulerPage } from './pages/SchedulerPage';
import { ChessPage } from './pages/ChessPage';
import { SignInPage } from './pages/SignInPage';
import { AccountPage } from './pages/AccountPage';
import { StreetWarriorPage } from './pages/StreetWarriorPage';
import { TicTacToePage } from './pages/TicTacToePage';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentMode, setCurrentMode] = useState<NavigationMode>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleModeChange = (mode: NavigationMode) => {
    setCurrentMode(mode);
  };

  const handleLoadingComplete = () => {
    setShowApp(true);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  const handleStartTool = (category: string, tool: string) => {
    setCurrentMode(tool as NavigationMode);
  };

  const renderCurrentPage = () => {
    const toolModes: NavigationMode[] = ['voice', 'text', 'scheduler', 'chess', 'streetwarrior', 'tictactoe'];
    
    // If it's a tool mode, wrap it in PlaygroundInterface
    if (toolModes.includes(currentMode)) {
      let toolContent;
      switch (currentMode) {
        case 'voice':
          toolContent = <VoiceInterface />;
          break;
        case 'text':
          toolContent = <TextInterface />;
          break;
        case 'scheduler':
          toolContent = <SchedulerPage />;
          break;
        case 'chess':
          toolContent = <ChessPage />;
          break;
        case 'streetwarrior':
          toolContent = <StreetWarriorPage />;
          break;
        case 'tictactoe':
          toolContent = <TicTacToePage />;
          break;
        default:
          toolContent = <div>Tool not found</div>;
      }
      
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <PlaygroundInterface currentTool={currentMode} onNavigate={handleModeChange}>
              {toolContent}
            </PlaygroundInterface>
          </motion.div>
        </AnimatePresence>
      );
    }

    // For non-tool pages (home, playpad, signin, account)
    const pages = {
      home: <HomePage onNavigate={handleModeChange} />,
      playpad: <PlaypadPage onNavigate={handleModeChange} onStartTool={handleStartTool} />,
      signin: <SignInPage onNavigate={handleModeChange} />,
      account: <AccountPage onNavigate={handleModeChange} />,
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMode}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {pages[currentMode as keyof typeof pages] || pages.home}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Loading Screen */}
        <LoadingScreen isVisible={isLoading} onComplete={handleLoadingComplete} />
        
        {/* Main App Content */}
        <AnimatePresence>
          {showApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Navigation - only show for home and playpad pages */}
              {(currentMode === 'home' || currentMode === 'playpad') && (
                <Navigation currentMode={currentMode} onModeChange={handleModeChange} />
              )}
              
              {/* Main Content */}
              <main className={`${
                currentMode === 'home' || currentMode === 'playpad' 
                  ? 'pt-0' 
                  : '' // PlaygroundInterface handles its own layout
              } ${
                currentMode === 'signin' || currentMode === 'account' 
                  ? '' 
                  : 'overflow-hidden'
              }`}>
                {renderCurrentPage()}
              </main>

              {/* Toast Notifications */}
              <Toaster />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}