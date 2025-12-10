"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type AppState = "landing" | "picker" | "lamp";

interface Blob {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  hue: number;
  saturation: number;
  lightness: number;
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateAnalogousColors(baseHue: number): number[] {
  return [
    baseHue,
    (baseHue + 30) % 360,
    (baseHue - 30 + 360) % 360,
    (baseHue + 15) % 360,
    (baseHue - 15 + 360) % 360,
  ];
}

function generateBlobs(baseHue: number, count: number = 12): Blob[] {
  const analogousHues = generateAnalogousColors(baseHue);

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 70 + 15,
    size: Math.random() * 100 + 80,
    duration: Math.random() * 8 + 10,
    delay: (i / count) * -10, // Stagger blobs evenly across the animation cycle
    hue: analogousHues[i % analogousHues.length],
    saturation: 70 + Math.random() * 20,
    lightness: 45 + Math.random() * 15,
  }));
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [selectedHue, setSelectedHue] = useState<number>(30);
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const colorWheelRef = useRef<HTMLDivElement>(null);

  const handleColorSelect = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorWheelRef.current) return;

    const rect = colorWheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // atan2 gives angle from positive x-axis, conic gradient starts from top (negative y)
    // So we use atan2(x, -y) to get the angle from top, clockwise
    const angle = Math.atan2(x, -y);
    const hue = ((angle * 180 / Math.PI) + 360) % 360;

    setSelectedHue(hue);
  }, []);

  const startLamp = useCallback(() => {
    setIsTransitioning(true);
    setBlobs(generateBlobs(selectedHue));
    setTimeout(() => {
      setAppState("lamp");
      setIsTransitioning(false);
    }, 500);
  }, [selectedHue]);

  const goToPicker = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setAppState("picker");
      setIsTransitioning(false);
    }, 500);
  }, []);

  const resetToLanding = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setAppState("landing");
      setIsTransitioning(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (appState === "lamp") {
      const interval = setInterval(() => {
        setBlobs(prev => prev.map(blob => ({
          ...blob,
          hue: (blob.hue + 0.1) % 360,
        })));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [appState]);

  return (
    <main className="min-h-screen w-full">
      {/* Landing Screen */}
      {appState === "landing" && (
        <div
          className={`fixed inset-0 shag-carpet flex flex-col items-center justify-center transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <div className="text-center">
            <h1
              className="font-[family-name:var(--font-pacifico)] text-6xl md:text-8xl text-[#f5e6d3] groovy-glow mb-4"
            >
              Blobscape
            </h1>
            <p className="text-xl md:text-2xl text-[#d4a574] mb-12 tracking-wide">
              Your Virtual Lava Lamp
            </p>

            {/* Decorative lava lamp icon */}
            <div className="mb-12">
              <div className="w-20 h-32 mx-auto relative">
                <div className="absolute inset-x-4 top-0 h-4 bg-[#d4a574] rounded-t-full"></div>
                <div className="absolute inset-x-2 top-4 bottom-4 bg-gradient-to-b from-[#2d1b0e] to-[#1a0f08] rounded-lg overflow-hidden">
                  <div
                    className="absolute w-6 h-6 bg-[#e85d04] rounded-full opacity-80"
                    style={{
                      bottom: "20%",
                      left: "25%",
                      animation: "blob-wobble 3s ease-in-out infinite"
                    }}
                  ></div>
                  <div
                    className="absolute w-4 h-4 bg-[#e85d04] rounded-full opacity-60"
                    style={{
                      bottom: "50%",
                      left: "45%",
                      animation: "blob-wobble 4s ease-in-out infinite reverse"
                    }}
                  ></div>
                </div>
                <div className="absolute inset-x-4 bottom-0 h-4 bg-[#d4a574] rounded-b-full"></div>
              </div>
            </div>

            <button
              onClick={goToPicker}
              className="retro-button px-10 py-4 text-xl text-[#f5e6d3] font-bold tracking-wider uppercase"
            >
              Get Groovy
            </button>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-[#d4a574] rounded-full opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-[#e85d04] rounded-full opacity-20"></div>
          <div className="absolute top-1/4 right-20 w-16 h-16 border-4 border-[#87714a] rounded-full opacity-20"></div>
        </div>
      )}

      {/* Color Picker Screen */}
      {appState === "picker" && (
        <div
          className={`fixed inset-0 wood-grain flex flex-col items-center justify-center transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <h2 className="font-[family-name:var(--font-righteous)] text-3xl md:text-4xl text-[#f5e6d3] mb-8">
            Pick Your Vibe
          </h2>

          {/* Color Wheel */}
          <div className="relative mb-8">
            <div
              ref={colorWheelRef}
              onClick={handleColorSelect}
              className="color-wheel w-64 h-64 md:w-80 md:h-80 shadow-2xl"
              style={{
                boxShadow: `0 0 40px ${hslToString(selectedHue, 70, 50)}40, 0 0 80px ${hslToString(selectedHue, 70, 50)}20`
              }}
            >
              {/* Center hole */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#2d1b0e] transition-colors duration-300"
                  style={{ backgroundColor: hslToString(selectedHue, 70, 50) }}
                ></div>
              </div>
            </div>

            {/* Selection indicator */}
            <div
              className="absolute w-4 h-4 bg-white rounded-full border-2 border-[#2d1b0e] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + 40 * Math.sin(selectedHue * Math.PI / 180)}%`,
                top: `${50 - 40 * Math.cos(selectedHue * Math.PI / 180)}%`,
              }}
            ></div>
          </div>

          {/* Preview color name */}
          <p className="text-[#d4a574] text-lg mb-8">
            Hue: {Math.round(selectedHue)}°
          </p>

          <div className="flex gap-4">
            <button
              onClick={resetToLanding}
              className="px-6 py-3 text-[#d4a574] border-2 border-[#d4a574] rounded-full hover:bg-[#d4a574] hover:text-[#2d1b0e] transition-colors"
            >
              Back
            </button>
            <button
              onClick={startLamp}
              className="retro-button px-8 py-3 text-[#f5e6d3] font-bold tracking-wider uppercase"
            >
              Light It Up
            </button>
          </div>
        </div>
      )}

      {/* Lava Lamp Screen */}
      {appState === "lamp" && (
        <div
          className={`fixed inset-0 lava-lamp cursor-pointer transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          onClick={goToPicker}
        >
          {/* Blobs */}
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="blob"
              style={{
                left: `${blob.x}%`,
                width: `${blob.size}px`,
                height: `${blob.size * 1.2}px`,
                backgroundColor: hslToString(blob.hue, blob.saturation, blob.lightness),
                boxShadow: `0 0 ${blob.size / 2}px ${hslToString(blob.hue, blob.saturation, blob.lightness)}, 0 0 ${blob.size}px ${hslToString(blob.hue, blob.saturation, blob.lightness)}40`,
                "--rise-duration": `${blob.duration}s`,
                "--delay": `${blob.delay}s`,
              } as React.CSSProperties}
            ></div>
          ))}

          {/* Subtle instruction */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#f5e6d3] opacity-30 text-sm pointer-events-none">
            Click anywhere to change color
          </div>

          {/* Ambient glow overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle at 50% 80%, ${hslToString(selectedHue, 50, 20)}30 0%, transparent 60%)`
            }}
          ></div>
        </div>
      )}
    </main>
  );
}
