'use client';


import React, { use, useRef } from 'react';
import { Card } from '@/components/ui/card';
import SnakeGame from '@/components/snake-game';
import ArrowKeys from '@/components/compact-arrow-keys';

// Define the type for arrow keys
type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

// Define the interface for the game ref
interface GameRef {
  handleKeyPress: (key: ArrowKey) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

const GameContainer = () => {
    const gameRef = useRef<GameRef>(null);
  
    const handleArrowPress = (key: ArrowKey) => {
      if (gameRef.current) {
        gameRef.current.handleKeyPress(key);
      }
    };

  // Handler for arrow key releases
  const handleArrowRelease = () => {
    // No specific release handling needed for snake game
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-[800px] mx-auto">
      <div className="w-full z-10">
        <SnakeGame ref={gameRef} />
      </div>
      
      <Card className="w-full bg-black/50 backdrop-blur-sm border-none shadow-lg">
        <div className="p-4">
          <ArrowKeys
            onArrowPress={handleArrowPress}
            onArrowRelease={handleArrowRelease}
          />
        </div>
      </Card>
    </div>
  );
};

export default GameContainer;