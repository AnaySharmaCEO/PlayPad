import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Swords, Play, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export const StreetWarriorPage: React.FC = () => {
  const handlePlayGame = () => {
    try {
      // Try to open the streetwarrior.py file
      // Note: This will only work in environments that support file system operations
      const filePath = 'streetwarrior.py';
      
      // For web browsers, we'll show a message about file execution
      toast.info('Attempting to launch Street Warrior game...', {
        description: 'This feature requires a local Python environment with streetwarrior.py file.'
      });
      
      // In a real desktop application, this would execute:
      // window.require('child_process').exec(`python ${filePath}`);
      
      console.log(`Attempting to execute: python ${filePath}`);
    } catch (error) {
      toast.error('Failed to launch game', {
        description: 'Make sure streetwarrior.py exists in your project directory.'
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
              <Swords className="h-16 w-16 text-foreground" />
            </motion.div>
            <CardTitle className="text-3xl mb-2">Street Warrior</CardTitle>
            <p className="text-muted-foreground text-lg">
              Intense combat fighting game with dynamic battles
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                Game Features
              </h3>
              <ul className="space-y-2 text-muted-foreground ml-7">
                <li>• Fast-paced combat system</li>
                <li>• Multiple fighting styles</li>
                <li>• Dynamic battle environments</li>
                <li>• Progressive difficulty levels</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                    System Requirements
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    Requires Python environment with streetwarrior.py file in the project directory.
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
                Play Game
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};