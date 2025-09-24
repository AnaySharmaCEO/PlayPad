import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MessageSquare, Calendar, Crown, Mic, Keyboard, ArrowRight, Home, Swords, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationMode } from '../components/Navigation';

interface PlaypadPageProps {
  onNavigate: (mode: NavigationMode) => void;
  onStartTool: (category: string, tool: string) => void;
}

type Category = 'Communication' | 'Work' | 'Game' | null;

export const PlaypadPage: React.FC<PlaypadPageProps> = ({ onNavigate, onStartTool }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);

  const categories = [
    {
      id: 'Communication' as const,
      title: 'Communication',
      description: 'Voice and text interactions with live captions',
      icon: MessageSquare,
      tools: [
        { id: 'voice', name: 'Voice Mode', description: 'AI conversation with speech recognition', icon: Mic },
        { id: 'text', name: 'Text Mode', description: 'Chat interface with markdown support', icon: Keyboard },
      ]
    },
    {
      id: 'Work' as const,
      title: 'Work',
      description: 'Productivity and scheduling tools',
      icon: Calendar,
      tools: [
        { id: 'scheduler', name: 'Scheduler', description: 'AI-powered task management and calendar', icon: Calendar },
      ]
    },
    {
      id: 'Game' as const,
      title: 'Game',
      description: 'Chess, combat, and strategic gameplay',
      icon: Crown,
      tools: [
        { id: 'chess', name: 'Chess', description: 'Professional chess with AI analysis', icon: Crown },
        { id: 'streetwarrior', name: 'Street Warrior', description: 'Combat fighting game', icon: Swords },
        { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Classic game against AI', icon: Grid3X3 },
      ]
    },
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleToolSelect = (toolId: string) => {
    onNavigate(toolId as NavigationMode);
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="absolute left-4 top-4 border border-border hover:border-foreground"
            >
              <Home className="h-4 w-4 mr-2" />
              {selectedCategory ? 'Categories' : 'Home'}
            </Button>
            <h1 className="text-4xl font-bold text-foreground">
              {selectedCategory ? `${selectedCategory} Tools` : 'PlayPad AI'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {selectedCategory 
              ? `Choose a ${selectedCategory.toLowerCase()} tool to get started`
              : 'Choose a category to begin your AI-powered workflow'
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            /* Category Selection */
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="h-full cursor-pointer border-2 border-border hover:border-foreground transition-all duration-300 bg-card group"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-6 border-2 border-border group-hover:border-foreground rounded-lg transition-all duration-300">
                          <Icon className="h-12 w-12 text-foreground" />
                        </div>
                        <CardTitle className="text-2xl">{category.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">{category.description}</p>
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <span>{category.tools.length} tool{category.tools.length > 1 ? 's' : ''} available</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Tool Selection */
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {categories
                .find(cat => cat.id === selectedCategory)
                ?.tools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="h-full cursor-pointer border-2 border-border hover:border-foreground transition-all duration-300 bg-card group">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto mb-4 p-6 border-2 border-border group-hover:border-foreground rounded-lg transition-all duration-300">
                            <Icon className="h-12 w-12 text-foreground" />
                          </div>
                          <CardTitle className="text-2xl">{tool.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-6">
                          <p className="text-muted-foreground">{tool.description}</p>
                          <Button
                            onClick={() => handleToolSelect(tool.id)}
                            className="w-full border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent text-foreground"
                            size="lg"
                          >
                            Launch {tool.name}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              }
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Sessions - Only show on category view */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-center">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <p>No recent sessions yet.</p>
                  <p className="text-sm mt-2">Start using a tool to see your session history here.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};