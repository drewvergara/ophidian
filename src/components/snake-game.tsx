import React, { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-react';

// declare global {
//   interface Window {
//     PIXI: typeof import('pixi.js');
//   }
// }

import * as PIXI from 'pixi.js';
declare global {
  interface Window {
    PIXI: typeof PIXI;
  }
}

interface Point {
  x: number;
  y: number;
}

interface Snake {
  body: Point[];
  graphics: import('pixi.js').Graphics;
}

interface Food {
  position: Point;
  graphics: import('pixi.js').Graphics;
}

interface GameState {
  direction: Point;
  nextDirection: Point;
  snake: Snake | null;
  food: Food | null;
  app: import('pixi.js').Application | null;
  moveTimer: ReturnType<typeof setInterval> | null;
}

const GAME_WIDTH = 360;
const CELL_SIZE = Math.floor(GAME_WIDTH / 15);
const GRID_SIZE = 15;
const MOVE_INTERVAL = 120;

const SnakeGame = React.forwardRef<{
  handleKeyPress: (event: { key: string; preventDefault?: () => void }) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}>((props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameStateRef = useRef<GameState>({
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    snake: null,
    food: null,
    app: null,
    moveTimer: null
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getRandomPosition = useCallback((): Point => {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    if (gameStateRef.current.snake?.body.some(
      segment => segment.x === position.x && segment.y === position.y
    )) {
      return getRandomPosition();
    }
    
    return position;
  }, []);

  const getRandomSnake = useCallback(() => {
    const padding = 4;
    const x = Math.floor(Math.random() * (GRID_SIZE - 2 * padding)) + padding;
    const y = Math.floor(Math.random() * (GRID_SIZE - 2 * padding)) + padding;
    
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    const initialDir = directions[Math.floor(Math.random() * directions.length)];
    
    const body = [];
    for (let i = 0; i < 3; i++) {
      body.push({
        x: x - (initialDir.x * i),
        y: y - (initialDir.y * i)
      });
    }
    
    return {
      body,
      direction: initialDir
    };
  }, []);

  const drawGame = useCallback(() => {
    const { snake, food } = gameStateRef.current;
    if (!snake || !food) return;

    // Update snake drawing style
    snake.graphics.clear();
    snake.body.forEach((segment, index) => {
      const isHead = index === 0;
      const padding = isHead ? 2 : 4;
      
      // Set line style for snake
      snake.graphics.lineStyle(1, 0x4ADE80, 1);
      snake.graphics.beginFill(0x000000, 0);
      
      snake.graphics.drawRoundedRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2,
        isHead ? 6 : 4
      );
      
      snake.graphics.endFill();
    });

    // Update food drawing style
    food.graphics.clear();
    food.graphics.lineStyle(1, 0xE9271D, 1);
    food.graphics.beginFill(0x000000, 0);
    food.graphics.drawCircle(
      food.position.x * CELL_SIZE + CELL_SIZE / 2,
      food.position.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3
    );
    food.graphics.endFill();
  }, []);

  const handleReset = useCallback(() => {
    const { app } = gameStateRef.current;
    if (!app) return;
    
    const randomSnake = getRandomSnake();
    const foodPosition = getRandomPosition();
    
    if (gameStateRef.current.snake) {
      gameStateRef.current.snake.graphics.clear();
    }
    if (gameStateRef.current.food) {
      gameStateRef.current.food.graphics.clear();
    }

    Object.assign(gameStateRef.current, {
      snake: {
        ...gameStateRef.current.snake,
        body: [...randomSnake.body]
      },
      food: {
        ...gameStateRef.current.food,
        position: foodPosition
      },
      direction: randomSnake.direction,
      nextDirection: randomSnake.direction
    });

    setScore(0);
    setGameOver(false);

    drawGame();
  }, [getRandomSnake, getRandomPosition, drawGame]);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    const { snake, food } = gameStateRef.current;
    if (!snake || !food) return;

    gameStateRef.current.direction = gameStateRef.current.nextDirection;
    const head = { ...snake.body[0] };
    head.x += gameStateRef.current.direction.x;
    head.y += gameStateRef.current.direction.y;

    if (
      head.x < 0 || 
      head.x >= GRID_SIZE || 
      head.y < 0 || 
      head.y >= GRID_SIZE ||
      snake.body.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      if (score > highScore) {
        setHighScore(score);
      }
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    snake.body.unshift(head);

    if (head.x === food.position.x && head.y === food.position.y) {
      setScore(prev => prev + 10);
      food.position = getRandomPosition();
    } else {
      snake.body.pop();
    }

    drawGame();
  }, [isPlaying, gameOver, score, highScore, getRandomPosition, drawGame]);

  const initGame = useCallback(() => {
    if (!window.PIXI || !containerRef.current) return;

    const app = new window.PIXI.Application({
      width: GRID_SIZE * CELL_SIZE,
      height: GRID_SIZE * CELL_SIZE,
      background: '#00000000',
      backgroundAlpha: 0,
      antialias: true,
      resolution: 1,
      eventMode: 'static',
      eventFeatures: {
        move: false,
        globalMove: false,
        click: false,
        wheel: false
      }
    });

    (app.view as HTMLCanvasElement).style.zIndex = '1';

    if (containerRef.current) {
      const existingCanvas = containerRef.current.querySelector('canvas');
      if (existingCanvas) {
        containerRef.current.removeChild(existingCanvas);
      }
      containerRef.current.appendChild(app.view as HTMLCanvasElement);
    }

    const snake = new window.PIXI.Graphics();
    const food = new window.PIXI.Graphics();
    
    app.stage.addChild(snake);
    app.stage.addChild(food);

    const randomSnake = getRandomSnake();
    gameStateRef.current = {
      app,
      snake: {
        body: [...randomSnake.body],
        graphics: snake
      },
      food: {
        position: getRandomPosition(),
        graphics: food
      },
      direction: randomSnake.direction,
      nextDirection: randomSnake.direction,
      moveTimer: null
    };

    drawGame();
  }, [getRandomSnake, getRandomPosition, drawGame]);

  const handleKeyPress = useCallback((event: { key: string; preventDefault?: () => void }) => {
    if (!isPlaying || gameOver) return;

    const key = event.key;
    const { direction } = gameStateRef.current;
    
    const keyDirections: Record<string, { x: number; y: number; opposite: boolean }> = {
      ArrowUp: { x: 0, y: -1, opposite: direction.y === 1 },
      ArrowDown: { x: 0, y: 1, opposite: direction.y === -1 },
      ArrowLeft: { x: -1, y: 0, opposite: direction.x === 1 },
      ArrowRight: { x: 1, y: 0, opposite: direction.x === -1 }
    };

    if (typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const newDirection = keyDirections[key];
    if (newDirection && !newDirection.opposite) {
      gameStateRef.current.nextDirection = { x: newDirection.x, y: newDirection.y };
    }
  }, [isPlaying, gameOver]);

  useImperativeHandle(ref, () => ({
    handleKeyPress,
    pause: () => setIsPlaying(false),
    resume: () => !gameOver && setIsPlaying(true),
    reset: handleReset
  }), [handleKeyPress, gameOver, handleReset]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.3.2/pixi.min.js';
    script.async = true;
    script.onload = () => setIsLoading(false);
    document.body.appendChild(script);

    return () => {
      document.body.contains(script) && document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !gameStateRef.current.app) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current && gameStateRef.current.app) {
            const width = entry.contentRect.width;
            gameStateRef.current.app.renderer.resize(width, width);
            drawGame();
          }
        }
      });
  
      const currentRef = containerRef.current;
      if (currentRef) {
        resizeObserver.observe(currentRef);
      }
  
      initGame();
  
      return () => {
        if (currentRef) {
          resizeObserver.disconnect();
        }
      };
    }
  }, [isLoading, initGame, drawGame]);

  useEffect(() => {
    if (!isLoading) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isLoading, handleKeyPress]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const timer = setInterval(moveSnake, MOVE_INTERVAL);
      gameStateRef.current.moveTimer = timer;
      return () => clearInterval(timer);
    }
    return () => {
      if (gameStateRef.current.moveTimer) {
        clearInterval(gameStateRef.current.moveTimer);
      }
    };
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    return () => {
      if (gameStateRef.current.app) {
        try {
          gameStateRef.current.app.destroy(true);
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="w-[360px] mx-auto bg-black/30 backdrop-blur-sm border-none rounded-none">
        <CardContent className="flex items-center justify-center h-80 font-mono font-light">
          <p className="text-sm text-white">Loading game...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[360px] bg-black/50 backdrop-blur-sm border-none mx-auto rounded-none">
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="flex justify-between items-center font-mono font-light text-md">
          <span className="text-[#FFF]">OPHIDIAN</span>
          <div className="flex gap-4">
            <span className="text-sm text-[#EF4444]">SCORE: {score}</span>
            <span className="text-sm text-[#000]">BEST: {highScore}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-12">
        <div className="flex flex-col items-center">
          <div className="border-t border-b border-white/10 border-dashed rounded-none relative" 
               style={{
                 width: GRID_SIZE * CELL_SIZE,
                 height: GRID_SIZE * CELL_SIZE,
               }}>
            <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 1 }}></div>
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
              {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      console.log('Start clicked');
                      setIsPlaying(true);
                    }}
                    className="w-32 h-12 bg-black/10 border border-dashed border-white font-mono text-[#FFF] text-sm"
                  >
                    <span className='duration-150 animate-bounce'>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    </span>
                    START
                  </Button>
                </div>
              )}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Button
                    variant="destructive"
                    onClick={handleReset}
                    className="w-32 h-12 bg-[#Ef4444]/10 border border-dashed border-red-500 font-mono text-[#FFA] text-sm"
                  >
                    <span className='animate-spin'>
                    <RefreshCwIcon className="w-5 h-5" />
                    </span>
                    <span className='animate-pulse ml-2'>
                    RESTART
                    </span>
                  </Button>
                </div>
              )}
              {(isPlaying && !gameOver) && (
                <Button
                  variant="secondary"
                  onClick={() => setIsPlaying(false)}
                  className="absolute bottom-[-40] right-[6] w-8 h-8 rounded-full p-0 z-100 bg-transparent border border-dotted text-[#FFF]"
                >
                  <PauseIcon className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
          {gameOver && (
            <p className="text-center text-destructive font-mono font-light text-sm mt-3 absolute z-20 top-[140px]">
              <span className="text-lg">Game Over!</span><br/><span className="text-xs text-muted-destructive">Click Restart to play again.</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

SnakeGame.displayName = 'SnakeGame';

export default SnakeGame