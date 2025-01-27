'use client';

import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import SnakeGame from '@/components/snake-game';
import ArrowKeys from '@/components/compact-arrow-keys';

// Define the type for arrow keys
type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

// Define the interface for the game ref to match SnakeGame's ref type
interface GameRef {
  handleKeyPress: (event: { key: string; preventDefault?: () => void }) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

const GameContainer: React.FC = () => {
  const gameRef = useRef<GameRef>(null);
  
  // Handle arrow key presses from the virtual keyboard
  const handleArrowPress = (key: ArrowKey) => {
    if (gameRef.current) {
      gameRef.current.handleKeyPress({ 
        key,
        preventDefault: () => {} 
      });
    }
  };

  // Handle physical keyboard events
  const handleKeyboardPress = (event: KeyboardEvent) => {
    const key = event.key;
    if (gameRef.current && 
        (key === 'ArrowUp' || 
         key === 'ArrowDown' || 
         key === 'ArrowLeft' || 
         key === 'ArrowRight')) {
      event.preventDefault();
      gameRef.current.handleKeyPress({
        key,
        preventDefault: () => event.preventDefault()
      });
    }
  };

  // Handle arrow key releases (no specific action needed for snake game)
  const handleArrowRelease = () => {
    // Can be implemented if needed in the future
  };

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyboardPress);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full max-w-[380px] mx-auto">
      <div className="border border-white/20">
      {/* Game Component */}
      <div className="w-full z-100">
        <SnakeGame ref={gameRef} />
      </div>

      {/* Virtual Controls */}
      <Card className="w-full bg-[#f7f4ed] backdrop-blur-sm border-none shadow-lg rounded-none z-10">
        <div className="w-[360px] p-0">
          <ArrowKeys
            onArrowPress={handleArrowPress}
            onArrowRelease={handleArrowRelease}
          />
        </div>
      </Card>

        </div>
    </div>
  );
};

export default GameContainer;