import Image from "next/image";
import GameContainer from "@/components/game-container";

export default function Home() {
  return (
    <div 
      className="bg-black min-h-full w-full justify-items-center bg-cover bg-center font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: 'url("/minimalist_abstract_squares.png")',
        backgroundColor: '#1a1a1a', // Fallback color while image loads
        backdropFilter: 'blur(5px)'
      }}      
      >
      {/* Overlay for better contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"
      ></div>
      {/* Mist overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.2) 25%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0) 100%
            )
          `
        }}
      ></div>
      
      {/* Noise filter SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <filter id="noise">
            <feTurbulence 
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="3"
              seed="1"
              stitchTiles="stitch"
            >
              <animate
                attributeName="seed"
                values="1;2;3;4;5;6;7;8;9;10"
                dur="2.0s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.5" intercept="-0.2" />
              <feFuncG type="linear" slope="1.5" intercept="-0.2" />
              <feFuncB type="linear" slope="1.5" intercept="-0.2" />
            </feComponentTransfer>
          </filter>
        </defs>
        
        <rect
          width="100%"
          height="100%"
          filter="url(#noise)"
          opacity="0.95"
          style={{ mixBlendMode: 'overlay' }}
        />
      </svg>      
      <main className="min-h-screen flex flex-col gap-4 row-start-2 items-center">
        <GameContainer/>
        <div className="mb-4">
          <a
          href="https://www.offekt.com"
          target="_blank"
          className="z-20"
        >
          <Image
              className="dark:invert"
              src="/offekt_logo_20250117@2x.png"
              alt="OFFEKT logo"
              width={88}
              height={27}
              priority
            />      
        </a>
        </div>
      </main>
    </div>
  );
}
