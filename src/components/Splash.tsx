import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

export default function Splash({ onComplete, isDarkMode }: SplashProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="splash-screen"
      className={`h-full w-full flex flex-col justify-between p-8 transition-colors duration-500 ${
        isDarkMode
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      {/* Top Margin */}
      <div></div>

      {/* Center Logo & Tagline */}
      <div className="flex flex-col items-center text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Ambient Glow behind logo in dark mode */}
          {isDarkMode && (
            <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-80" />
          )}
          
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-800 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                : "bg-zinc-50 border-zinc-200 shadow-sm"
            }`}
          >
            <Sparkles className={`w-10 h-10 ${isDarkMode ? "text-white" : "text-zinc-900"}`} />
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl font-display font-semibold tracking-tight"
          >
            FocusFlow <span className="font-light">AI</span>
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`text-sm tracking-wide uppercase font-mono ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Your AI Productivity Companion
          </motion.p>
        </div>
      </div>

      {/* Bottom Loading / CTA */}
      <div className="space-y-8">
        {loadingProgress < 100 ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono tracking-widest text-zinc-500">
              <span>INITIALIZING CORE ENGINE</span>
              <span>{loadingProgress}%</span>
            </div>
            <div className={`h-[1px] w-full transition-colors duration-500 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-150"}`}>
              <motion.div
                className={`h-full ${isDarkMode ? "bg-white" : "bg-black"}`}
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
          </div>
        ) : (
          <motion.button
            id="splash-get-started"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onComplete}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-medium tracking-tight flex items-center justify-center space-x-2 transition-all duration-300 border ${
              isDarkMode
                ? "bg-white text-black border-white hover:bg-zinc-100"
                : "bg-black text-white border-black hover:bg-zinc-900"
            }`}
          >
            <span>Enter Studio</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}

        <p className="text-center text-[10px] tracking-wide font-mono text-zinc-500">
          DESIGNED FOR HIGH-PERFORMANCE INTELLECTUALS &bull; V1.2.0
        </p>
      </div>
    </div>
  );
}
