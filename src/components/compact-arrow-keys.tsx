import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card } from '@/components/ui/card';

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

interface CubeEffectSVGProps {
  isActive: boolean;
}

interface KeyButtonProps {
  arrowKey: ArrowKey;
  isActive: boolean;
  onKeyPress: (key: ArrowKey) => void;
  onKeyRelease: () => void;
}

interface ArrowKeysProps {
  onArrowPress: (key: ArrowKey) => void;
  onArrowRelease: () => void;
}

interface KeyMapItem {
  symbol: string;
  label: string;
  color: string;
}

type KeyMap = {
  [K in ArrowKey]: KeyMapItem;
};

const CubeEffectSVG: React.FC<CubeEffectSVGProps> = memo(({ isActive }) => (
  <>
    <div className={`
      absolute left-4 top-4
      transition-all duration-150 transform
      ${isActive ? 'translate-x-2 translate-y-2 scale-95' : ''}
    `}>
      <svg width="64" height="64" className="absolute" aria-hidden="true">
        <rect 
          x="0" y="0" width="64" height="64"
          rx="8" ry="8"
          fill="none" 
          stroke="rgba(255,255,255,0.25)" 
          strokeWidth="2"
          strokeDasharray="1 3"
        >
          <animate
            attributeName="strokeDashoffset"
            values="4;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
    <div className={`
      absolute left-0 top-0
      transition-all duration-150 transform
      ${isActive ? 'translate-x-2 translate-y-2 scale-95' : ''}
    `}>
      <svg width="80" height="80" aria-hidden="true">
        {[
          [0, 0, 16, 16],
          [64, 0, 80, 16],
          [0, 64, 16, 80],
          [64, 64, 80, 80]
        ].map(([x1, y1, x2, y2], index) => (
          <line 
            key={index}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            strokeDasharray="1 3"
          >
            <animate
              attributeName="strokeDashoffset"
              values="4;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    </div>
  </>
));

CubeEffectSVG.displayName = 'CubeEffectSVG';

const KeyButton: React.FC<KeyButtonProps> = ({ 
  arrowKey, 
  isActive, 
  onKeyPress, 
  onKeyRelease 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const keyMap: KeyMap = {
    ArrowUp: { symbol: '↑', label: 'Up Arrow', color: 'text-cyan-400' },
    ArrowLeft: { symbol: '←', label: 'Left Arrow', color: 'text-purple-400' },
    ArrowDown: { symbol: '↓', label: 'Down Arrow', color: 'text-green-400' },
    ArrowRight: { symbol: '→', label: 'Right Arrow', color: 'text-orange-400' }
  };
  
  const { symbol, label, color } = keyMap[arrowKey];

  const handlePress = () => {
    onKeyPress(arrowKey);
  };
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CubeEffectSVG isActive={isActive} />
      
      <div className={`
        absolute inset-0 bg-white/5 rounded transform
        transition-all duration-300
        ${isActive ? 'scale-125 opacity-0' : 'scale-100 opacity-0'}
      `} />
      
      <Card 
        role="button"
        aria-label={label}
        aria-pressed={isActive}
        tabIndex={0}
        className={`
          w-16 h-16 flex items-center justify-center text-xl font-light
          transition-all duration-150 cursor-pointer select-none relative z-10
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
          transform rounded
          ${isActive ? 
            'bg-gray-700 text-white translate-x-2 translate-y-2 scale-95' : 
            'bg-black text-gray-300 hover:translate-x-1 hover:translate-y-1'
          }
          ${isHovered ? 'shadow-lg shadow-white/10' : ''}
        `}
        onMouseDown={handlePress}
        onMouseUp={onKeyRelease}
        onMouseLeave={() => {
          setIsHovered(false);
          onKeyRelease();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          handlePress();
        }}
        onTouchEnd={onKeyRelease}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePress();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onKeyRelease();
          }
        }}
      >
        <span className={`
          transition-transform duration-150
          ${isActive ? 'scale-90 text-white' : `scale-100 ${color}`}
          ${isHovered ? 'animate-bounce' : ''}
        `}>
          {symbol}
        </span>
      </Card>
    </div>
  );
};

const ArrowKeys: React.FC<ArrowKeysProps> = ({ onArrowPress, onArrowRelease }) => {
  const [activeKey, setActiveKey] = useState<ArrowKey | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key as ArrowKey;
    if (['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(key)) {
      event.preventDefault();
      setActiveKey(key);
      onArrowPress(key);
    }
  }, [onArrowPress]);

  const handleKeyUp = useCallback(() => {
    setActiveKey(null);
    onArrowRelease();
  }, [onArrowRelease]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="w-full flex items-center justify-center p-4">
      <Card className="w-[380px] p-8 bg-transparent border-none rounded-none">
        <div className="grid grid-cols-3 gap-8" role="group" aria-label="Arrow Keys">
          <div className="col-start-2">
            <KeyButton 
              arrowKey="ArrowUp"
              isActive={activeKey === "ArrowUp"}
              onKeyPress={(key) => {
                setActiveKey(key);
                onArrowPress(key);
              }}
              onKeyRelease={handleKeyUp}
            />
          </div>
          <div className="col-span-3 flex justify-between">
            {(['ArrowLeft', 'ArrowDown', 'ArrowRight'] as const).map((key) => (
              <KeyButton 
                key={key}
                arrowKey={key}
                isActive={activeKey === key}
                onKeyPress={(key) => {
                  setActiveKey(key);
                  onArrowPress(key);
                }}
                onKeyRelease={handleKeyUp}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArrowKeys;