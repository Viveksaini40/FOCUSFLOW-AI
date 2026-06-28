import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, User, KeyRound, ArrowRight } from "lucide-react";

interface AuthProps {
  onSuccess: (userEmail: string) => void;
  isDarkMode: boolean;
}

export default function Auth({ onSuccess, isDarkMode }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate luxury swift auth transition
    setTimeout(() => {
      setLoading(false);
      onSuccess(email);
    }, 1200);
  };

  const prefillTestCredentials = () => {
    setEmail("innovator@focusflow.ai");
    setPassword("password123");
    setName("Vivek Saini");
  };

  return (
    <div
      id="auth-screen"
      className={`h-full w-full flex flex-col justify-between p-6 transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center space-x-2 pt-4">
        <Sparkles className={`w-5 h-5 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`} />
        <span className="font-display font-semibold tracking-tight text-sm">FocusFlow AI</span>
      </div>

      {/* Main Glass Card Form */}
      <div className="my-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-medium tracking-tight">
            {isLogin ? "Authenticate Studio" : "Establish Flow Identity"}
          </h2>
          <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
            {isLogin ? "Resuming deep focus session" : "Welcome to high-performance focus management"}
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs rounded-lg bg-red-950/20 border border-red-900/30 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest text-zinc-500 block">NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="Vivek Saini"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border focus:outline-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-zinc-950 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700"
                      : "bg-zinc-50 border-zinc-200 focus:border-zinc-400 text-black placeholder-zinc-400"
                  }`}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-zinc-500 block">EMAIL SYSTEM ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="auth-email-input"
                type="email"
                placeholder="innovator@focusflow.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border focus:outline-none transition-all duration-300 ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700"
                    : "bg-zinc-50 border-zinc-200 focus:border-zinc-400 text-black placeholder-zinc-400"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-zinc-500 block">SECURITY ACCESS KEY</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="auth-password-input"
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border focus:outline-none transition-all duration-300 ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700"
                    : "bg-zinc-50 border-zinc-200 focus:border-zinc-400 text-black placeholder-zinc-400"
                }`}
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 border flex items-center justify-center space-x-2 ${
                isDarkMode
                  ? "bg-white text-black border-white hover:bg-zinc-100"
                  : "bg-black text-white border-black hover:bg-zinc-900"
              }`}
            >
              {loading ? (
                <span className="animate-pulse">SYNCHRONIZING SECURE TUNNEL...</span>
              ) : (
                <>
                  <span>{isLogin ? "Authenticate" : "Establish Flow Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Demo Fast Login Accents */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          <button
            id="auth-prefill-btn"
            onClick={prefillTestCredentials}
            className={`text-[11px] font-mono hover:underline ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            &bull; Fast Demo Prefill &bull;
          </button>
        </div>
      </div>

      {/* Alternative Options */}
      <div className="space-y-4 pb-4">
        <div className="relative flex py-2 items-center">
          <div className={`flex-grow border-t ${isDarkMode ? "border-zinc-900" : "border-zinc-200"}`}></div>
          <span className={`flex-shrink mx-4 text-[9px] font-mono tracking-widest ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}>
            SECURE INTEGRATED LOGINS
          </span>
          <div className={`flex-grow border-t ${isDarkMode ? "border-zinc-900" : "border-zinc-200"}`}></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSuccess("vivek.google@gmail.com")}
            className={`py-3 rounded-xl text-xs font-medium border flex items-center justify-center space-x-2 transition-all duration-300 ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-800 hover:border-zinc-600 text-zinc-300"
                : "bg-zinc-50 border-zinc-200 hover:border-zinc-400 text-zinc-700"
            }`}
          >
            <span>Google Workspace</span>
          </button>
          <button
            type="button"
            onClick={() => onSuccess("vivek.apple@icloud.com")}
            className={`py-3 rounded-xl text-xs font-medium border flex items-center justify-center space-x-2 transition-all duration-300 ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-800 hover:border-zinc-600 text-zinc-300"
                : "bg-zinc-50 border-zinc-200 hover:border-zinc-400 text-zinc-700"
            }`}
          >
            <span>Apple Account</span>
          </button>
        </div>

        <p className="text-center text-[11px]">
          <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>
            {isLogin ? "New to FocusFlow?" : "Already registered?"}
          </span>{" "}
          <button
            id="auth-toggle-mode"
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className={`font-semibold underline transition-colors ${
              isDarkMode ? "text-white hover:text-zinc-200" : "text-black hover:text-zinc-700"
            }`}
          >
            {isLogin ? "Initiate Flow Identity" : "Authenticate credentials"}
          </button>
        </p>
      </div>
    </div>
  );
}
