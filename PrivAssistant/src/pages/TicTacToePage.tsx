import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Grid3X3, Play, AlertCircle, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export const TicTacToePage: React.FC = () => {
  const handlePlayGame = () => {
    try {
      // Try to open the tictactoe.py file
      // Note: This will only work in environments that support file system operations
      const filePath = 'tictactoe.py';
      
      // For web browsers, we'll show a message about file execution
      toast.info('Attempting to launch Tic Tac Toe game...', {
        description: 'This feature requires a local Python environment with tictactoe.py file.'
      });
      
      // In a real desktop application, this would execute:
      // window.require('child_process').exec(`python ${filePath}`);
      
      console.log(`Attempting to execute: python ${filePath}`);
    } catch (error) {
      toast.error('Failed to launch game', {
        description: 'Make sure tictactoe.py exists in your project directory.'
      });
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-border hover:border-foreground transition-all duration-300">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 p-8 border-2 border-border rounded-xl bg-muted/50"
            >
              <Grid3X3 className="h-16 w-16 text-foreground" />
            </motion.div>
            <CardTitle className="text-3xl mb-2">Tic Tac Toe</CardTitle>
            <p className="text-muted-foreground text-lg">
              Classic strategy game against intelligent AI
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Bot className="h-5 w-5 mr-2 text-muted-foreground" />
                AI Features
              </h3>
              <ul className="space-y-2 text-muted-foreground ml-7">
                <li>• Intelligent AI opponent</li>
                <li>• Multiple difficulty levels</li>
                <li>• Strategic move analysis</li>
                <li>• Classic 3x3 grid gameplay</li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4 bg-muted/20 rounded-xl">
              {/* Visual representation of tic-tac-toe grid */}
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square border border-border rounded bg-background flex items-center justify-center text-2xl text-muted-foreground/30"
                >
                  {i === 0 ? 'X' : i === 4 ? 'O' : i === 8 ? 'X' : ''}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                    System Requirements
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Requires Python environment with tictactoe.py file in the project directory.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={handlePlayGame}
                size="lg"
                className="px-12 py-6 text-lg border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent text-foreground"
              >
                <Play className="h-6 w-6 mr-3" />
                Play vs AI
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};