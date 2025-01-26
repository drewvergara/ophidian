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

  const handlePause = () => {
    if (gameRef.current) {
      gameRef.current.pause();
    }
  };

  const handleResume = () => {
    if (gameRef.current) {
      gameRef.current.resume();
    }
  };

  const handleReset = () => {
    if (gameRef.current) {
      gameRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4 w-full max-w-[380px] mx-auto">
      {/* Game Component */}
      <div className="w-full z-10">
        <SnakeGame ref={gameRef} />
      </div>
      
      {/* Game Controls */}
      {/*}
      <div className="flex gap-4 mt-4 z-10">
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Pause
        </button>
        <button
          onClick={handleResume}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Resume
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
      */}

      {/* Virtual Controls */}
      <Card className="w-full bg-black/30 backdrop-blur-sm border-none shadow-lg rounded-none">
        <div className="w-[360px] p-0">
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