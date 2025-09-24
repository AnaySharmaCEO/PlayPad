import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RotateCcw, Undo, RefreshCw, Crown, Bot, Users, Maximize, Minimize } from 'lucide-react';
import { motion } from 'motion/react';

// Simple chess piece representation
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

type ChessBoard = (ChessPiece | null)[][];

interface ChessBoardProps {
  gameMode: 'ai' | 'local';
  difficulty: 'easy' | 'medium' | 'hard';
  onGameModeChange: (mode: 'ai' | 'local') => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

// Chess piece Unicode symbols
const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

// Initialize standard chess board
const initializeBoard = (): ChessBoard => {
  const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Black pieces
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ];
  board[1] = Array(8).fill({ type: 'pawn', color: 'black' });
  
  // White pieces
  board[6] = Array(8).fill({ type: 'pawn', color: 'white' });
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ];
  
  return board;
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  gameMode,
  difficulty,
  onGameModeChange,
  onDifficultyChange,
}) => {
  const [board, setBoard] = useState<ChessBoard>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('White to move');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if path is clear for sliding pieces
  const isPathClear = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const rowDir = Math.sign(toRow - fromRow);
    const colDir = Math.sign(toCol - fromCol);
    
    let currentRow = fromRow + rowDir;
    let currentCol = fromCol + colDir;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowDir;
      currentCol += colDir;
    }
    
    return true;
  };

  // Get all valid moves for a piece
  const getValidMovesForPiece = (row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece || piece.color !== currentPlayer) return [];
    
    const validMoves: [number, number][] = [];
    
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(row, col, toRow, toCol)) {
          validMoves.push([toRow, toCol]);
        }
      }
    }
    
    return validMoves;
  };

  // Enhanced move validation
  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    // Basic checks
    if (fromRow === toRow && fromCol === toCol) return false;
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== currentPlayer) return false;
    
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        if (fromCol === toCol) {
          // Forward move
          if (toRow === fromRow + direction && !targetPiece) return true;
          if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) return true;
        } else if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece) {
          // Capture
          return true;
        }
        return false;
      
      case 'rook':
        return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
      
      case 'bishop':
        return rowDiff === colDiff && isPathClear(fromRow, fromCol, toRow, toCol);
      
      case 'queen':
        return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && isPathClear(fromRow, fromCol, toRow, toCol);
      
      case 'king':
        return rowDiff <= 1 && colDiff <= 1;
      
      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      
      default:
        return false;
    }
  };

  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (!isValidMove(fromRow, fromCol, toRow, toCol)) return false;
    
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];
    
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    setBoard(newBoard);
    
    // Record move
    const moveNotation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + toCol)}${8 - toRow}${capturedPiece ? 'x' : ''}`;
    setMoveHistory(prev => [...prev, moveNotation]);
    
    // Switch players
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    setCurrentPlayer(nextPlayer);
    setGameStatus(`${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)} to move`);
    
    return true;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      if (fromRow === row && fromCol === col) {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        // Try to make move
        if (makeMove(fromRow, fromCol, row, col)) {
          setSelectedSquare(null);
          setValidMoves([]);
          
          // Trigger AI move if in AI mode
          if (gameMode === 'ai' && currentPlayer === 'white') {
            setTimeout(makeAIMove, 1000);
          }
        } else {
          // Select new piece if it belongs to current player
          const piece = board[row][col];
          if (piece && piece.color === currentPlayer) {
            setSelectedSquare([row, col]);
            setValidMoves(getValidMovesForPiece(row, col));
          } else {
            setSelectedSquare(null);
            setValidMoves([]);
          }
        }
      }
    } else {
      // Select piece if it belongs to current player
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
        setValidMoves(getValidMovesForPiece(row, col));
      }
    }
  };

  const makeAIMove = () => {
    if (gameMode !== 'ai' || currentPlayer !== 'black') return;
    
    setIsThinking(true);
    
    setTimeout(() => {
      // Simple AI: find all valid moves and pick one randomly
      const validMoves: Array<[number, number, number, number]> = [];
      
      for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
          const piece = board[fromRow][fromCol];
          if (piece && piece.color === 'black') {
            for (let toRow = 0; toRow < 8; toRow++) {
              for (let toCol = 0; toCol < 8; toCol++) {
                if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                  validMoves.push([fromRow, fromCol, toRow, toCol]);
                }
              }
            }
          }
        }
      }
      
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(...randomMove);
      }
      
      setIsThinking(false);
    }, Math.random() * 2000 + 500); // 0.5-2.5 second delay
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setIsThinking(false);
    setGameStatus('White to move');
  };

  const undoMove = () => {
    if (moveHistory.length === 0) return;
    
    // Simple undo - just reset the board and replay moves minus the last one(s)
    const newHistory = [...moveHistory];
    if (gameMode === 'ai' && newHistory.length >= 2) {
      newHistory.pop(); // Remove AI move
      newHistory.pop(); // Remove player move
    } else {
      newHistory.pop();
    }
    
    setBoard(initializeBoard());
    setMoveHistory(newHistory);
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setValidMoves([]);
    setIsThinking(false);
    setGameStatus('White to move');
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto flex flex-col' : 'space-y-6'}`}>
      {/* Fullscreen Toggle Button */}
      {!isFullscreen && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="rounded-xl border-2 hover:border-foreground"
          >
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      )}

      {/* Game Controls */}
      <Card className="rounded-xl border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Chess Game
            </CardTitle>
            
            {isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="rounded-xl border-2 hover:border-foreground"
              >
                <Minimize className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              {/* Game Mode Toggle */}
              <div className="flex rounded-xl border border-border overflow-hidden">
                <Button
                  variant={gameMode === 'ai' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onGameModeChange('ai')}
                  className="rounded-none"
                >
                  <Bot className="h-4 w-4 mr-1" />
                  vs AI
                </Button>
                <Button
                  variant={gameMode === 'local' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onGameModeChange('local')}
                  className="rounded-none"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Local
                </Button>
              </div>

              {/* Difficulty for AI mode */}
              {gameMode === 'ai' && (
                <div className="flex rounded-xl border border-border overflow-hidden">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onDifficultyChange(level)}
                      className="rounded-none capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Game Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {gameMode === 'ai' ? `AI (${difficulty})` : 'Local Play'}
              </Badge>
              {gameMode === 'ai' && (
                <Badge className={`${getDifficultyColor(difficulty)} text-white`}>
                  {difficulty}
                </Badge>
              )}
              {isThinking && (
                <Badge variant="secondary" className="animate-pulse">
                  AI Thinking...
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Move {Math.floor(moveHistory.length / 2) + 1}
            </div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <p className="text-sm">{gameStatus}</p>
          </div>

          {/* Game Controls */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetGame}
              className="rounded-xl"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={undoMove}
              disabled={moveHistory.length === 0 || isThinking}
              className="rounded-xl"
            >
              <Undo className="h-4 w-4 mr-2" />
              Undo
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Board flipped')}
              className="rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Flip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chess Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex justify-center ${isFullscreen ? 'flex-1 items-center' : ''}`}
      >
        <div className={`rounded-xl overflow-hidden shadow-lg border border-border bg-white dark:bg-gray-800 aspect-square ${isFullscreen ? 'w-full max-w-[800px]' : 'w-full max-w-[600px]'}`}>
          <div className="grid grid-cols-8 gap-0 w-full h-full">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                const isValidMoveSquare = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
                
                return (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      flex items-center justify-center cursor-pointer relative
                      ${isFullscreen ? 'text-3xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'}
                      ${isLightSquare ? 'bg-amber-50 dark:bg-amber-100' : 'bg-amber-600 dark:bg-amber-700'}
                      ${isSelected ? 'ring-2 sm:ring-4 ring-primary ring-inset' : ''}
                      ${isValidMoveSquare ? 'ring-2 ring-green-500 ring-inset' : ''}
                      hover:ring-2 hover:ring-primary/50 hover:ring-inset transition-all
                      aspect-square
                    `}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {piece && (
                      <span 
                        className={`select-none ${piece.color === 'white' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}`}
                      >
                        {pieceSymbols[piece.color][piece.type]}
                      </span>
                    )}
                    
                    {/* Valid move indicator */}
                    {isValidMoveSquare && !piece && (
                      <div className="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
                    )}
                    
                    {/* Capture indicator */}
                    {isValidMoveSquare && piece && (
                      <div className="absolute inset-0 border-2 border-red-500 rounded opacity-70"></div>
                    )}
                    
                    {/* Square coordinates */}
                    <div className={`absolute bottom-0 right-0 text-muted-foreground/50 pr-1 pb-1 select-none ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                      {String.fromCharCode(97 + colIndex)}{8 - rowIndex}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Fullscreen game status */}
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center space-x-4 bg-card border border-border rounded-xl px-6 py-3">
              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="text-sm font-medium">{gameStatus}</div>
              {isThinking && (
                <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded animate-pulse">
                  AI Thinking...
                </div>
              )}
              <div className="text-sm text-muted-foreground">Move: {Math.floor(moveHistory.length / 2) + 1}</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Move History - only show when not fullscreen */}
      {!isFullscreen && (
        <Card className="rounded-xl border-border/50">
          <CardHeader>
            <CardTitle>Move History</CardTitle>
          </CardHeader>
          <CardContent>
            {moveHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">No moves yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {moveHistory.map((move, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm p-2 bg-muted/50 rounded text-center"
                  >
                    {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Close fullscreen overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};