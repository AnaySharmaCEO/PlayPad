import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { 
  MessageSquare, Calendar, Crown, Mic, Keyboard, 
  ChevronLeft, ChevronRight, Plus, Clock, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationMode } from './Navigation';

interface PlaygroundInterfaceProps {
  currentTool: NavigationMode;
  onNavigate: (mode: NavigationMode) => void;
  children: React.ReactNode;
}

interface Session {
  id: string;
  name: string;
  tool: NavigationMode;
  category: 'Communication' | 'Work' | 'Game';
  timestamp: Date;
  preview?: string;
}

export const PlaygroundInterface: React.FC<PlaygroundInterfaceProps> = ({ 
  currentTool, 
  onNavigate, 
  children 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      name: 'Voice Chat Session',
      tool: 'voice',
      category: 'Communication',
      timestamp: new Date(Date.now() - 3600000),
      preview: 'Discussed project requirements...'
    },
    {
      id: '2',
      name: 'Weekly Planning',
      tool: 'scheduler',
      category: 'Work',
      timestamp: new Date(Date.now() - 7200000),
      preview: 'Organized team meetings...'
    },
    {
      id: '3',
      name: 'Chess Analysis',
      tool: 'chess',
      category: 'Game',
      timestamp: new Date(Date.now() - 10800000),
      preview: 'Analyzed Queen\'s Gambit opening...'
    },
  ]);

  const toolCategories = {
    voice: 'Communication',
    text: 'Communication',
    scheduler: 'Work',
    chess: 'Game'
  };

  const toolIcons = {
    voice: Mic,
    text: Keyboard,
    scheduler: Calendar,
    chess: Crown
  };

  const categoryIcons = {
    Communication: MessageSquare,
    Work: Calendar,
    Game: Crown
  };

  const currentCategory = toolCategories[currentTool as keyof typeof toolCategories];
  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.category]) acc[session.category] = [];
    acc[session.category].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 60 : 300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-secondary border-r border-border flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-semibold text-foreground">Playground</h2>
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* New Session Button */}
        <div className="p-4">
          <Button
            onClick={() => onNavigate('playpad')}
            className="w-full border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent text-foreground"
            size={sidebarCollapsed ? "icon" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">New Session</span>}
          </Button>
        </div>

        {/* Current Tool */}
        {!sidebarCollapsed && (
          <div className="px-4 pb-4">
            <Card className="border border-border bg-background">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 border border-border rounded-lg">
                    {React.createElement(toolIcons[currentTool as keyof typeof toolIcons], {
                      className: "h-4 w-4 text-foreground"
                    })}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{currentTool}</p>
                    <p className="text-sm text-muted-foreground">{currentCategory}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Session History */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-foreground">Recent Sessions</h3>
              
              {Object.entries(groupedSessions).map(([category, categorySessions]) => {
                const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CategoryIcon className="h-4 w-4" />
                      <span>{category}</span>
                    </div>
                    
                    {categorySessions.map((session) => {
                      const SessionIcon = toolIcons[session.tool as keyof typeof toolIcons];
                      const isActive = session.tool === currentTool;
                      
                      return (
                        <motion.div
                          key={session.id}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-200 ${
                              isActive 
                                ? 'border-foreground bg-foreground text-background' 
                                : 'border-border hover:border-foreground hover:bg-muted'
                            }`}
                            onClick={() => onNavigate(session.tool)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start space-x-3">
                                <div className={`p-1 rounded ${
                                  isActive ? 'bg-background text-foreground' : 'bg-muted'
                                }`}>
                                  <SessionIcon className="h-3 w-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{session.name}</p>
                                  <p className={`text-xs truncate ${
                                    isActive ? 'text-background/70' : 'text-muted-foreground'
                                  }`}>
                                    {session.preview}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Clock className="h-3 w-3 mr-1 opacity-50" />
                                    <span className={`text-xs ${
                                      isActive ? 'text-background/70' : 'text-muted-foreground'
                                    }`}>
                                      {formatTimeAgo(session.timestamp)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Tool Header */}
        <header className="bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('playpad')}
                className="border border-border hover:border-foreground"
              >
                ← Back to Categories
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <div className="p-2 border border-border rounded-lg">
                  {React.createElement(toolIcons[currentTool as keyof typeof toolIcons], {
                    className: "h-5 w-5 text-foreground"
                  })}
                </div>
                <div>
                  <h1 className="font-semibold capitalize">{currentTool} Mode</h1>
                  <p className="text-sm text-muted-foreground">{currentCategory}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border hover:border-foreground"
                onClick={() => onNavigate('account')}
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        </header>

        {/* Tool Content */}
        <div className="flex-1 overflow-auto bg-background p-4">
          <div className="h-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};