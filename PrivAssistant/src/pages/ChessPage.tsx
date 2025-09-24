import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Crown, Lightbulb, TrendingUp, Target, Play, Bot, Users } from 'lucide-react';
import { ChessBoard } from '../components/ChessBoard';
import { motion, AnimatePresence } from 'motion/react';

export const ChessPage: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<'ai' | 'local'>('ai');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [hint, setHint] = useState<{ move: string; explanation: string } | null>(null);
  const [analysis, setAnalysis] = useState<Array<{ move: string; evaluation: string; description: string }>>([]);
  
  const analyzePosition = async (position: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/chess/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(prev => [...prev, {
          move: data.bestMove,
          evaluation: data.evaluation,
          description: data.analysis,
        }]);
      } else {
        throw new Error('Failed to analyze position');
      }
    } catch (error) {
      console.error('Error analyzing position:', error);
    }
  };

  const gameStats = {
    totalGames: 12,
    wins: 7,
    draws: 2,
    losses: 3,
    winRate: '58%',
  };

  return (
    <div className="h-full overflow-auto">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          // Chess Tool Selection Screen
          <motion.div
            key="chess-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col justify-center"
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center mb-6"
              >
                <Crown className="h-12 w-12 text-primary mr-3" />
                <h1 className="text-4xl font-semibold">Chess</h1>
              </motion.div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Challenge AI opponents or play locally with real-time analysis and strategic insights
              </p>
            </div>

            {/* Game Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    gameMode === 'ai' 
                      ? 'border-foreground bg-foreground text-background' 
                      : 'border-border hover:border-foreground'
                  }`}
                  onClick={() => setGameMode('ai')}
                >
                  <CardContent className="p-8 text-center">
                    <Bot className={`h-12 w-12 mx-auto mb-4 ${
                      gameMode === 'ai' ? 'text-background' : 'text-primary'
                    }`} />
                    <h3 className="text-xl font-semibold mb-2">vs AI</h3>
                    <p className={`text-sm ${
                      gameMode === 'ai' ? 'text-background/70' : 'text-muted-foreground'
                    }`}>
                      Challenge intelligent AI opponents with adjustable difficulty levels
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    gameMode === 'local' 
                      ? 'border-foreground bg-foreground text-background' 
                      : 'border-border hover:border-foreground'
                  }`}
                  onClick={() => setGameMode('local')}
                >
                  <CardContent className="p-8 text-center">
                    <Users className={`h-12 w-12 mx-auto mb-4 ${
                      gameMode === 'local' ? 'text-background' : 'text-primary'
                    }`} />
                    <h3 className="text-xl font-semibold mb-2">Local Play</h3>
                    <p className={`text-sm ${
                      gameMode === 'local' ? 'text-background/70' : 'text-muted-foreground'
                    }`}>
                      Play with friends on the same device with turn-based gameplay
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Difficulty Selection for AI Mode */}
            {gameMode === 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-center mb-4">Select Difficulty</h3>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? 'default' : 'outline'}
                      onClick={() => setDifficulty(level)}
                      className={`capitalize ${
                        difficulty === level 
                          ? 'bg-foreground text-background' 
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Play Chess Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Button
                onClick={() => setGameStarted(true)}
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 px-12 py-6 text-lg"
              >
                <Play className="h-6 w-6 mr-3" />
                Play Chess
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
            >
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-lg font-semibold">67%</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <Crown className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-lg font-semibold">143</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Best Streak</p>
                  <p className="text-lg font-semibold">12</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          // Chess Game Screen
          <motion.div
            key="chess-game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 py-8 h-full overflow-auto"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => setGameStarted(false)}
                className="border-border hover:border-foreground"
              >
                ← Back to Setup
              </Button>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold">
                  {gameMode === 'ai' ? `AI Chess (${difficulty})` : 'Local Chess'}
                </h1>
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chess Board Area */}
              <div className="lg:col-span-3">
                <ChessBoard
                  gameMode={gameMode}
                  difficulty={difficulty}
                  onGameModeChange={setGameMode}
                  onDifficultyChange={setDifficulty}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Game Statistics */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="rounded-xl border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Statistics
                      </CardTitle>
                    </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-muted/50 rounded-xl">
                          <div className="text-lg">{gameStats.wins}</div>
                          <div className="text-xs text-muted-foreground">Wins</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-xl">
                          <div className="text-lg">{gameStats.draws}</div>
                          <div className="text-xs text-muted-foreground">Draws</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-xl">
                          <div className="text-lg">{gameStats.losses}</div>
                          <div className="text-xs text-muted-foreground">Losses</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-xl">
                          <div className="text-lg">{gameStats.winRate}</div>
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                        </div>
                      </div>
                    </CardContent>
                </Card>
                </motion.div>

                {/* AI Analysis */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="rounded-xl border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Make a move to see AI analysis</p>
                        </div>
                      ) : (
                        analysisData.map((analysis, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-3 bg-muted/50 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{analysis.move}</span>
                              <span className="text-xs text-muted-foreground">
                                {analysis.evaluation}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {analysis.description}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </CardContent>
                </Card>
                </motion.div>

                {/* Training Tips */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="rounded-xl border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Training Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-xl">
                        <h4 className="text-sm mb-1">Opening Principles</h4>
                        <p className="text-xs text-muted-foreground">
                          Control the center with pawns and develop knights before bishops.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-xl">
                        <h4 className="text-sm mb-1">Tactical Awareness</h4>
                        <p className="text-xs text-muted-foreground">
                          Always check for pins, forks, and skewers before moving.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-xl">
                        <h4 className="text-sm mb-1">Endgame Focus</h4>
                        <p className="text-xs text-muted-foreground">
                          King activity becomes crucial in the endgame phase.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};