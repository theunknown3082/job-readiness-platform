import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Hi, let's get back to being great.",
  "Consistency compounds. Master one problem at a time.",
  "Calibrating technical readiness and memory retention.",
  "Deep practice turns algorithms into intuition.",
];

export const IntroSplash: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    // Check if the user has already seen the intro during this browser session
    const hasSeen = sessionStorage.getItem('has_seen_intro_splash');
    if (!hasSeen) {
      // Pick quote
      const randomQuote =
        MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setQuote(randomQuote);
      setIsVisible(true);

      // Start fade out after 1400ms
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1400);

      // Remove from DOM after 1800ms
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('has_seen_intro_splash', 'true');
      }, 1800);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('has_seen_intro_splash', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950 text-white transition-opacity duration-500 cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-lg text-center space-y-5 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-white text-zinc-900 items-center justify-center font-bold text-xl shadow-2xl mx-auto">
          JR
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {quote}
          </h1>
          <p className="text-xs text-zinc-400 font-mono flex items-center justify-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-400" />
            Initializing candidate telemetry & decay models...
          </p>
        </div>

        {/* Minimalist progress bar */}
        <div className="w-48 mx-auto bg-zinc-800 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-400 rounded-full animate-[progress_1.3s_ease-in-out_forwards]" />
        </div>

        <div className="text-[10px] text-zinc-500 font-mono tracking-wider">
          Click anywhere to skip
        </div>
      </div>
    </div>
  );
};
