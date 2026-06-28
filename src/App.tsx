import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Layers,
  Calendar,
  Clock,
  BarChart3,
  Plus,
  Send,
  Zap,
  Flame,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Mic,
  Moon,
  Sun,
  User,
  Sliders,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  Compass,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import Splash from "./components/Splash";
import Auth from "./components/Auth";
import { Task, TimeBlock, BurnoutAssessment, Goal, FocusSession, Message, AIAnalysisResult } from "./types";

export default function App() {
  // Theme & App State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<"splash" | "auth" | "dashboard">("splash");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "focus" | "insights">("home");

  // Core Data State (Preloaded with rich, premium bento demo data)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Deliver Pitch Deck & Financial Forecast",
      priority: "high",
      deadline: "Today, 5:00 PM",
      category: "Work",
      completed: false,
      aiPriority: "high",
      riskLevel: "critical",
      riskReason: "High priority with tight midday submission frame.",
      actionPlan: [
        "Finalize standard customer acquisition model calculations",
        "Refine market size analysis slide using latest data",
        "Export vector high-fidelity graphics to PDF",
        "Verify pitch alignment with series-A checklist"
      ],
      estimatedMinutes: 90
    },
    {
      id: "task-2",
      title: "Vibe System UI Design Tokens",
      priority: "high",
      deadline: "Today, 10:00 PM",
      category: "Project",
      completed: true,
      aiPriority: "medium",
      riskLevel: "safe",
      riskReason: "Design system already published. Action complete.",
      actionPlan: ["Define black & white color variables", "Build typography pairings", "Verify container margins"],
      estimatedMinutes: 60
    },
    {
      id: "task-3",
      title: "Consolidate Q3 Roadmap Objectives",
      priority: "medium",
      deadline: "Tomorrow, 12:00 PM",
      category: "Work",
      completed: false,
      aiPriority: "medium",
      riskLevel: "moderate",
      riskReason: "Sufficient preparation buffer, but requires cross-team alignment.",
      actionPlan: ["Draft OKR metrics", "Schedule review with product leads", "Align engineer capacity"],
      estimatedMinutes: 45
    },
    {
      id: "task-4",
      title: "Mindfulness Breathing Routine",
      priority: "low",
      deadline: "Today, 9:30 PM",
      category: "Personal",
      completed: false,
      aiPriority: "low",
      riskLevel: "safe",
      riskReason: "Flexible personal recharge block.",
      actionPlan: ["Disconnect screen for 15 minutes", "Practice box breathing", "Record cognitive fatigue state"],
      estimatedMinutes: 15
    }
  ]);

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { time: "09:00 AM - 10:30 AM", activity: "Deep Work: Pitch Deck Forecast", taskId: "task-1" },
    { time: "11:00 AM - 12:00 PM", activity: "Admin: Email & Strategy Sync", taskId: "task-3" },
    { time: "02:00 PM - 03:00 PM", activity: "Flow State: Design System Refinement", taskId: "task-2" },
    { time: "04:00 PM - 04:30 PM", activity: "Coaching: AI Burnout Recovery", taskId: "task-4" }
  ]);

  const [burnout, setBurnout] = useState<BurnoutAssessment>({
    riskLevel: "Moderate",
    warningMessage: "High cognitive load expected between 10:00 AM and 3:00 PM today.",
    recommendation: "Limit high-priority screen exposure to 90-minute blocks. Force a 10-minute pause."
  });

  const [productivityScore, setProductivityScore] = useState<number>(88);
  const [coachMessage, setCoachMessage] = useState<string>(
    "Welcome to FocusFlow AI. I have built custom block-bookings for your morning. Let's attack the Pitch Deck first."
  );

  // New Task Input UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newDeadline, setNewDeadline] = useState("Today, 6:00 PM");
  const [newCategory, setNewCategory] = useState<"Work" | "Study" | "Project" | "Personal">("Work");
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Coach Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      content: "Greetings. I am your FocusFlow AI productivity companion. Tell me what blocks your flow today.",
      timestamp: "09:00 AM"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Focus Timer Pomodoro State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [completedFocusSessions, setCompletedFocusSessions] = useState<FocusSession[]>([
    { id: "s1", taskTitle: "Pitch Deck Foundation", durationMinutes: 25, timestamp: "Yesterday" },
    { id: "s2", taskTitle: "System Color Tokens", durationMinutes: 25, timestamp: "Today" }
  ]);

  // Goals & Trends State
  const [goals, setGoals] = useState<Goal[]>([
    { id: "g1", title: "Daily Focus Blocks", targetCount: 4, currentCount: 2, period: "daily" },
    { id: "g2", title: "Overdue Risk Minimization", targetCount: 7, currentCount: 6, period: "weekly" },
    { id: "g3", title: "Personal Recharge Breaks", targetCount: 3, currentCount: 1, period: "daily" }
  ]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ff_user");
    const savedTheme = localStorage.getItem("ff_theme");
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentScreen("dashboard");
    }
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Sync scroll on chat messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Focus Timer ticking logic
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds((s) => s - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes((m) => m - 1);
          setTimerSeconds(59);
        } else {
          // Timer finished
          setTimerRunning(false);
          const isFocus = timerMode === "focus";
          if (isFocus) {
            const newSession: FocusSession = {
              id: `session_${Date.now()}`,
              taskTitle: "Deep Work Session",
              durationMinutes: 25,
              timestamp: "Just Now"
            };
            setCompletedFocusSessions((prev) => [newSession, ...prev]);
            setGoals((prev) =>
              prev.map((g) =>
                g.id === "g1" ? { ...g, currentCount: Math.min(g.targetCount, g.currentCount + 1) } : g
              )
            );
            setProductivityScore((p) => Math.min(100, p + 3));
            alert("Optimal block complete. Excellent energy retention.");
            // Switch to break
            setTimerMode("break");
            setTimerMinutes(5);
          } else {
            alert("Break ended. Calibrating system focus...");
            setTimerMode("focus");
            setTimerMinutes(25);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMinutes, timerSeconds, timerMode]);

  // Trigger server-side AI workload analysis
  const triggerAIAnalysis = async (inputTaskData?: any) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/focusflow/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          inputTask: inputTaskData || null
        })
      });

      if (!response.ok) throw new Error("Analysis failed");
      const result: AIAnalysisResult = await response.json();

      // Merge updated AI evaluations to current tasks
      const mergedTasks = tasks.map((t) => {
        const match = result.prioritizedTasks.find((pt) => pt.title.toLowerCase() === t.title.toLowerCase());
        if (match) {
          return {
            ...t,
            aiPriority: match.aiPriority,
            riskLevel: match.riskLevel,
            riskReason: match.riskReason,
            actionPlan: match.actionPlan,
            estimatedMinutes: match.estimatedMinutes
          };
        }
        return t;
      });

      // Add any new task returned by the engine
      result.prioritizedTasks.forEach((pt) => {
        const exists = mergedTasks.some((t) => t.title.toLowerCase() === pt.title.toLowerCase());
        if (!exists) {
          mergedTasks.push({
            id: pt.id || `task_${Date.now()}`,
            title: pt.title,
            priority: pt.aiPriority || "medium",
            deadline: "Today, 6:00 PM",
            category: "Work",
            completed: false,
            aiPriority: pt.aiPriority,
            riskLevel: pt.riskLevel,
            riskReason: pt.riskReason,
            actionPlan: pt.actionPlan,
            estimatedMinutes: pt.estimatedMinutes
          });
        }
      });

      setTasks(mergedTasks);
      setTimeBlocks(result.timeBlocks);
      setBurnout(result.burnoutAssessment);
      setProductivityScore(result.productivityScore);
      setCoachMessage(result.coachMessage);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Create a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTitle,
      priority: newPriority,
      deadline: newDeadline,
      category: newCategory,
      completed: false
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    setNewTitle("");
    setShowAddModal(false);

    // Call server AI to integrate immediately
    await triggerAIAnalysis(newTask);
  };

  // Submit messages to AI Coach
  const handleSendCoachMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/focusflow/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error("Coach response failed");
      const reply = await response.json();

      const coachMsg: Message = {
        id: `c_${Date.now()}`,
        role: "assistant",
        content: reply.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      // Fallback
      setChatMessages((prev) => [
        ...prev,
        {
          id: `c_${Date.now()}`,
          role: "assistant",
          content: "I received high latency on the secure link. Let's maintain a minimalist agenda. Break your biggest task into 3 sub-actions.",
          timestamp: "Just Now"
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Toggle task status
  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    // Dynamic recalculation of productivity score
    const target = tasks.find(t => t.id === id);
    if (target) {
      setProductivityScore((p) => {
        const diff = target.completed ? -5 : 5;
        return Math.max(40, Math.min(100, p + diff));
      });
    }
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Voice simulator trigger
  const triggerVoiceSimulator = () => {
    setIsVoiceInput(true);
    const simulatedTranscripts = [
      "Submit final branding UI assets to lead engineer by 4pm today",
      "Draft next marketing strategy outline and coordinate the workspace integration",
      "Need to schedule project sync tomorrow at 10 AM to resolve critical delays"
    ];
    setTimeout(() => {
      const randomText = simulatedTranscripts[Math.floor(Math.random() * simulatedTranscripts.length)];
      setNewTitle(randomText);
      setIsVoiceInput(false);
    }, 1800);
  };

  // Toggle B&W Theme
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem("ff_theme", nextMode ? "dark" : "light");
  };

  // Logged success from Auth
  const handleAuthSuccess = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem("ff_user", email);
    setCurrentScreen("dashboard");
    // Trigger initial AI block optimization on load
    triggerAIAnalysis();
  };

  // Clear user auth
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ff_user");
    setCurrentScreen("auth");
  };

  return (
    <div
      id="root-container"
      className={`min-h-screen w-full flex items-center justify-center font-sans select-none transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"
      }`}
    >
      {/* Absolute background accent grids to capture the luxury/futuristic start-up bento mood */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />
        </div>
      )}

      {/* Main Responsive iPhone / Tablet Device Canvas Mockup */}
      <div
        id="device-frame"
        className={`w-full max-w-md h-[844px] md:rounded-[3rem] md:border-8 shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-900 text-white shadow-white/[0.02]"
            : "bg-white border-neutral-200 text-neutral-900"
        }`}
      >
        {/* Device Status Bar */}
        <div className="h-10 px-6 flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-500 border-b transition-colors duration-500 border-transparent">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-[10px]">FOCUSFLOW</span>
            <span className="text-[9px] px-1 bg-zinc-800 text-zinc-400 rounded-sm">AI</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>2026 UTC</span>
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
              title="Toggle Black & White theme presets"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-zinc-800" />}
            </button>
          </div>
        </div>

        {/* Dynamic Route/Screen Renderer */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentScreen === "splash" && (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Splash onComplete={() => setCurrentScreen("auth")} isDarkMode={isDarkMode} />
              </motion.div>
            )}

            {currentScreen === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Auth onSuccess={handleAuthSuccess} isDarkMode={isDarkMode} />
              </motion.div>
            )}

            {currentScreen === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full pb-20 p-5 flex flex-col space-y-5"
              >
                {/* -------------------- HOME SCREEN -------------------- */}
                {activeTab === "home" && (
                  <div className="space-y-4">
                    {/* Header Bento Title */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-display font-medium tracking-tight">Flow Dashboard</h2>
                        <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Logged as {currentUser?.split("@")[0] || "operator"}
                        </p>
                      </div>
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="text-[10px] font-mono tracking-widest text-zinc-500 hover:underline"
                      >
                        LOGOUT
                      </button>
                    </div>

                    {/* AI Coach Motivation Banner */}
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 relative overflow-hidden ${
                        isDarkMode
                          ? "bg-zinc-950 border-zinc-900 text-zinc-300"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-mono text-[10px] tracking-widest text-zinc-500">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                        <span>COGNITIVE INTELLIGENCE CALIBRATION</span>
                      </div>
                      <p className="italic">"{coachMessage}"</p>
                      {isAnalyzing && (
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500 animate-pulse mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                          <span>Re-allocating focus vectors...</span>
                        </div>
                      )}
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Grid Item 1: Productivity Score */}
                      <div
                        className={`p-4 rounded-2xl border flex flex-col justify-between h-32 ${
                          isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500">
                          <span>FLOW INDEX</span>
                          <BarChart3 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-4xl font-display font-bold tracking-tight">{productivityScore}</span>
                          <span className="text-xs text-zinc-500">/100</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`h-[2px] w-full ${isDarkMode ? "bg-zinc-900" : "bg-zinc-200"}`}>
                            <div
                              className={`h-full ${isDarkMode ? "bg-white" : "bg-black"}`}
                              style={{ width: `${productivityScore}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                            Optimal buffer active
                          </p>
                        </div>
                      </div>

                      {/* Grid Item 2: Burnout Assessment */}
                      <div
                        className={`p-4 rounded-2xl border flex flex-col justify-between h-32 ${
                          isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500">
                          <span>BURNOUT GAURD</span>
                          <Flame className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                burnout.riskLevel === "High"
                                  ? "bg-red-500 animate-pulse"
                                  : burnout.riskLevel === "Moderate"
                                  ? "bg-zinc-400"
                                  : "bg-zinc-200"
                              }`}
                            ></span>
                            <span className="text-base font-medium">{burnout.riskLevel} Risk</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-snug">
                            {burnout.warningMessage}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab("insights");
                            // auto focus on recovery recommendation
                          }}
                          className="text-[9px] text-left underline tracking-wider text-zinc-500 hover:text-zinc-400 font-mono"
                        >
                          CALIBRATE RECOVERY
                        </button>
                      </div>
                    </div>

                    {/* AI-Prioritized Priorities List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500">
                          INTELLECTUAL WORKLOAD AGENDA
                        </span>
                        <button
                          id="btn-trigger-analysis"
                          onClick={() => triggerAIAnalysis()}
                          className={`text-[10px] font-mono hover:underline flex items-center space-x-1 ${
                            isDarkMode ? "text-zinc-400" : "text-zinc-600"
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          <span>Optimize Priorities</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            id={`task-item-${task.id}`}
                            className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                              task.completed
                                ? "opacity-50"
                                : ""
                            } ${
                              isDarkMode
                                ? "bg-zinc-950 border-zinc-900 hover:border-zinc-800"
                                : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className="flex items-start justify-between space-x-2">
                              <div className="flex items-start space-x-3">
                                <button
                                  id={`checkbox-task-${task.id}`}
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                    task.completed
                                      ? "bg-zinc-800 border-zinc-700 text-white"
                                      : isDarkMode
                                      ? "border-zinc-700 hover:border-zinc-500"
                                      : "border-neutral-300 hover:border-neutral-500"
                                  }`}
                                >
                                  {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                                </button>
                                <div>
                                  <h4
                                    className={`text-xs font-semibold leading-tight ${
                                      task.completed ? "line-through text-zinc-500" : ""
                                    }`}
                                  >
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
                                    <span
                                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                        isDarkMode ? "bg-zinc-900 text-zinc-400" : "bg-zinc-200 text-zinc-700"
                                      }`}
                                    >
                                      {task.category}
                                    </span>
                                    <span className="text-[9px] text-zinc-500 font-mono">
                                      {task.deadline}
                                    </span>
                                    {task.riskLevel && (
                                      <span
                                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center space-x-0.5 ${
                                          task.riskLevel === "critical"
                                            ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                                            : "bg-zinc-900/40 text-zinc-500"
                                        }`}
                                      >
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                        <span>{task.riskLevel} risk</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                id={`delete-task-${task.id}`}
                                onClick={() => deleteTask(task.id)}
                                className="text-zinc-600 hover:text-zinc-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Show integrated AI risk warnings & action plans dynamically */}
                            {!task.completed && task.actionPlan && (
                              <div
                                className={`mt-3 pt-3 border-t text-[11px] space-y-2 ${
                                  isDarkMode ? "border-zinc-900" : "border-neutral-200"
                                }`}
                              >
                                <div className="flex items-center space-x-1 text-zinc-500 font-mono text-[9px] tracking-wider">
                                  <Sparkles className="w-3 h-3 text-zinc-400" />
                                  <span>AI BREAKDOWN & RISK PREDICTION</span>
                                </div>
                                <p className={`text-zinc-400 italic text-[10px]`}>
                                  "{task.riskReason}"
                                </p>
                                <ul className="space-y-1.5 pl-1.5 border-l border-zinc-800">
                                  {task.actionPlan.map((step, sIdx) => (
                                    <li key={sIdx} className="flex items-start space-x-1.5 text-zinc-500 text-[10px]">
                                      <span className="font-mono mt-0.5 text-zinc-600 font-semibold">{sIdx + 1}.</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Launch Focus Bar */}
                    <div
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-zinc-200"}`}>
                          <Clock className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">Ready to Lock Focus?</p>
                          <p className="text-[10px] text-zinc-500">25-minute calibrated interval</p>
                        </div>
                      </div>
                      <button
                        id="home-quick-focus"
                        onClick={() => {
                          setTimerMinutes(25);
                          setTimerSeconds(0);
                          setTimerRunning(true);
                          setActiveTab("focus");
                        }}
                        className={`px-4 py-2 text-[10px] font-semibold font-mono uppercase tracking-widest rounded-xl transition-all duration-300 border ${
                          isDarkMode
                            ? "bg-white text-black border-white hover:bg-zinc-200"
                            : "bg-black text-white border-black hover:bg-zinc-850"
                        }`}
                      >
                        Engage Timer
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------- CALENDAR & SCHEDULER -------------------- */}
                {activeTab === "schedule" && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-display font-medium tracking-tight">Smart Schedule</h2>
                      <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        AI-optimized focus blocks calibrated to prevent last-minute delays
                      </p>
                    </div>

                    {/* Interactive Calendar Days Mock Slider */}
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {[
                        { day: "MON", date: "28", active: true },
                        { day: "TUE", date: "29", active: false },
                        { day: "WED", date: "30", active: false },
                        { day: "THU", date: "01", active: false },
                        { day: "FRI", date: "02", active: false }
                      ].map((d, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-2xl border text-center transition-all duration-300 ${
                            d.active
                              ? isDarkMode
                                ? "bg-zinc-900 border-zinc-700 text-white shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                                : "bg-neutral-100 border-neutral-300 text-black font-semibold"
                              : isDarkMode
                              ? "bg-zinc-950 border-zinc-900/55 text-zinc-500"
                              : "bg-neutral-50/50 border-neutral-200 text-neutral-400"
                          }`}
                        >
                          <span className="text-[9px] font-mono uppercase block">{d.day}</span>
                          <span className="text-sm font-display font-bold mt-1 block">{d.date}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI Time Optimization Recommendations card */}
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                        isDarkMode
                          ? "bg-zinc-950 border-zinc-900 text-zinc-400"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-mono text-[9px] tracking-widest text-zinc-500 mb-1">
                        <Compass className="w-3.5 h-3.5 text-zinc-400" />
                        <span>TIME SLICE CALIBRATION REPORT</span>
                      </div>
                      <p>
                        Your biological cognitive peaks reside between <span className="text-zinc-200 font-medium">9:30 AM</span> and <span className="text-zinc-200 font-medium">11:30 AM</span>. 
                        FocusFlow has automated defense locks on key deliverables.
                      </p>
                    </div>

                    {/* Dynamic Time-Blocked Schedule Items */}
                    <div className="space-y-3 pt-1">
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500">
                        CHRONO BLOCKS TODAY
                      </span>

                      <div className="space-y-2">
                        {timeBlocks.map((block, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border flex items-start justify-between space-x-3 transition-colors ${
                              isDarkMode
                                ? "bg-zinc-950 border-zinc-900 hover:border-zinc-800"
                                : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-right pt-0.5">
                                <span className="text-[10px] font-mono text-zinc-400 block whitespace-nowrap">
                                  {block.time.split(" - ")[0]}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500 block">
                                  START
                                </span>
                              </div>
                              <div className={`h-8 w-[1px] ${isDarkMode ? "bg-zinc-800" : "bg-neutral-300"}`}></div>
                              <div>
                                <h4 className="text-xs font-semibold leading-tight">{block.activity}</h4>
                                <span className="text-[9px] text-zinc-500 mt-1 block">
                                  {block.time.split(" - ")[1]} &bull; High Focus Density
                                </span>
                              </div>
                            </div>

                            <span className="text-[9px] font-mono uppercase bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">
                              Calibrated
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------- FOCUS MODE & TIMER -------------------- */}
                {activeTab === "focus" && (
                  <div className="h-full flex flex-col justify-between py-2 space-y-6">
                    <div className="text-center space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                        COGNITIVE RE-CHARGE STATION
                      </span>
                      <h2 className="text-xl font-display font-medium tracking-tight">Focus Chamber</h2>
                    </div>

                    {/* Stunning Minimal Ticking Circle */}
                    <div className="flex flex-col items-center justify-center my-auto">
                      <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Background SVG Circle Tracker */}
                        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="transparent"
                            className={isDarkMode ? "text-zinc-900" : "text-neutral-100"}
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="44"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="transparent"
                            strokeDasharray="276"
                            strokeDashoffset={276 - (276 * ((timerMinutes * 60 + timerSeconds) / (timerMode === "focus" ? 1500 : 300)))}
                            className={isDarkMode ? "text-white" : "text-black"}
                            transition={{ ease: "linear" }}
                          />
                        </svg>

                        {/* Interactive Timing Text */}
                        <div className="text-center space-y-1">
                          <span className="text-5xl font-mono font-light tracking-tight">
                            {timerMinutes.toString().padStart(2, "0")}
                            <span className="animate-pulse">:</span>
                            {timerSeconds.toString().padStart(2, "0")}
                          </span>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                            {timerMode === "focus" ? "DEEP COGNITION BLOCK" : "RECHARGE INTERVAL"}
                          </p>
                        </div>
                      </div>

                      {/* Control Panel Buttons */}
                      <div className="flex items-center space-x-4 mt-8">
                        <button
                          id="btn-timer-reset"
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerMinutes(timerMode === "focus" ? 25 : 5);
                            setTimerSeconds(0);
                          }}
                          className={`p-3 rounded-xl border transition-colors ${
                            isDarkMode
                              ? "bg-zinc-950 border-zinc-900 hover:bg-zinc-900 text-zinc-400"
                              : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-zinc-700"
                          }`}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          id="btn-timer-toggle"
                          onClick={() => setTimerRunning(!timerRunning)}
                          className={`px-8 py-3.5 rounded-xl font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 border flex items-center space-x-2 ${
                            isDarkMode
                              ? "bg-white text-black border-white hover:bg-zinc-100"
                              : "bg-black text-white border-black hover:bg-zinc-900"
                          }`}
                        >
                          {timerRunning ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Pause session</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Initiate Flow</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Today's Focus Session stats */}
                    <div className="space-y-2 pt-4">
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500">
                        TODAY'S INTELLECTUAL ENERGY MARGINS
                      </span>
                      <div className="space-y-2">
                        {completedFocusSessions.map((s) => (
                          <div
                            key={s.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-neutral-50 border-neutral-200"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="font-medium">{s.taskTitle}</span>
                            </div>
                            <span className="font-mono text-[10px] text-zinc-500">{s.durationMinutes}m &bull; {s.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------- INSIGHTS & COACH -------------------- */}
                {activeTab === "insights" && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-display font-medium tracking-tight">AI Insights</h2>
                      <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Performance logs, recovery metrics, and smart coaching
                      </p>
                    </div>

                    {/* Goals & Habits metrics */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500">
                        GOAL RETENTION TARGETS
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {goals.map((g) => (
                          <div
                            key={g.id}
                            className={`p-3 rounded-xl border text-xs space-y-2 ${
                              isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-neutral-50 border-neutral-200"
                            }`}
                          >
                            <div className="flex items-center justify-between font-medium">
                              <span>{g.title}</span>
                              <span className="font-mono text-[10px] text-zinc-500">
                                {g.currentCount} of {g.targetCount} &bull; {g.period}
                              </span>
                            </div>
                            <div className={`h-[3px] w-full ${isDarkMode ? "bg-zinc-900" : "bg-zinc-200"}`}>
                              <div
                                className={`h-full ${isDarkMode ? "bg-white" : "bg-black"}`}
                                style={{ width: `${(g.currentCount / g.targetCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Integrated AI Coach Workspace (Simulated Chat Endpoint) */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500 block">
                        FOCUSFLOW INTELLECTUAL COMPANION
                      </span>

                      <div
                        className={`h-64 rounded-2xl border flex flex-col justify-between overflow-hidden ${
                          isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        {/* Messages Arena */}
                        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar text-xs">
                          {chatMessages.map((m) => (
                            <div
                              key={m.id}
                              className={`flex flex-col space-y-1 ${
                                m.role === "user" ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                  m.role === "user"
                                    ? isDarkMode
                                      ? "bg-zinc-900 text-white"
                                      : "bg-zinc-200 text-black"
                                    : isDarkMode
                                    ? "bg-zinc-900/40 text-zinc-300 border border-zinc-900"
                                    : "bg-white text-zinc-800 border border-neutral-100"
                                }`}
                              >
                                {m.content.split("\n").map((line, lIdx) => (
                                  <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>{line}</p>
                                ))}
                              </div>
                              <span className="text-[9px] text-zinc-600 font-mono px-1">
                                {m.role === "user" ? "YOU" : "FF COACH"} &bull; {m.timestamp}
                              </span>
                            </div>
                          ))}
                          {chatLoading && (
                            <div className="flex items-center space-x-1.5 text-zinc-500 font-mono text-[10px] animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                              <span>Cohesive response formulating...</span>
                            </div>
                          )}
                          <div ref={chatBottomRef} />
                        </div>

                        {/* Message Input bar */}
                        <form
                          onSubmit={handleSendCoachMsg}
                          className={`p-2 border-t flex items-center space-x-2 ${
                            isDarkMode ? "border-zinc-900" : "border-neutral-200"
                          }`}
                        >
                          <input
                            id="coach-chat-input"
                            type="text"
                            placeholder="Ask about focus blockers, fatigue, schedule..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none transition-all ${
                              isDarkMode
                                ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600"
                                : "bg-white border border-neutral-200 text-black placeholder-neutral-400"
                            }`}
                          />
                          <button
                            id="coach-send-btn"
                            type="submit"
                            disabled={chatLoading}
                            className={`p-2 rounded-xl ${
                              isDarkMode ? "bg-white text-black" : "bg-black text-white"
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Floating Add Task Trigger */}
        {currentScreen === "dashboard" && activeTab === "home" && (
          <div className="absolute right-6 bottom-24 z-30">
            <motion.button
              id="dashboard-add-task-trigger"
              onClick={() => setShowAddModal(true)}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 rounded-full border shadow-xl flex items-center justify-center transition-all ${
                isDarkMode
                  ? "bg-white text-black border-white hover:bg-zinc-100"
                  : "bg-black text-white border-black hover:bg-zinc-900"
              }`}
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        {/* Global Floating Custom Task Modal with High Fidelity AI Analyzer */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 flex items-end justify-center">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className={`w-full rounded-t-[2.5rem] border-t p-6 pb-8 space-y-5 transition-colors duration-300 ${
                isDarkMode ? "bg-zinc-950 border-zinc-900 text-white" : "bg-white border-neutral-200 text-neutral-900"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                    INTEGRATE NEW FOCUS INTENT
                  </span>
                </div>
                <button
                  id="close-add-modal"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-mono tracking-widest text-zinc-500 hover:underline"
                >
                  DISMISS
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      TASK TITLE / INTELLECTUAL DELIVERABLE
                    </label>
                    <button
                      id="voice-input-btn"
                      type="button"
                      onClick={triggerVoiceSimulator}
                      className="text-[9px] font-mono tracking-widest text-zinc-500 flex items-center space-x-1 hover:text-zinc-300 transition-colors"
                    >
                      <Mic className={`w-3 h-3 ${isVoiceInput ? "animate-pulse text-red-500" : ""}`} />
                      <span>{isVoiceInput ? "LISTENING..." : "SIMULATE VOICE INPUT"}</span>
                    </button>
                  </div>
                  <input
                    id="new-task-title"
                    type="text"
                    required
                    placeholder="e.g., Deploy core landing page or draft project specs"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-xs focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700"
                        : "bg-zinc-50 border border-neutral-200 focus:border-neutral-400 text-black placeholder-neutral-400"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      INTENSITY PRE-ACCENT
                    </label>
                    <select
                      id="new-task-priority"
                      value={newPriority}
                      onChange={(e: any) => setNewPriority(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-zinc-50 border border-neutral-200 text-black"
                      }`}
                    >
                      <option value="high">High priority</option>
                      <option value="medium">Medium priority</option>
                      <option value="low">Low priority</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      CATEGORY SEGMENT
                    </label>
                    <select
                      id="new-task-category"
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-zinc-50 border border-neutral-200 text-black"
                      }`}
                    >
                      <option value="Work">Work</option>
                      <option value="Study">Study</option>
                      <option value="Project">Project</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                    TIMELINE DEADLINE WINDOW
                  </label>
                  <input
                    id="new-task-deadline"
                    type="text"
                    required
                    placeholder="e.g., Today, 5:00 PM"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-xs focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700"
                        : "bg-zinc-50 border border-neutral-200 focus:border-neutral-400 text-black placeholder-neutral-400"
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    id="submit-create-task"
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all duration-300 border flex items-center justify-center space-x-2 ${
                      isDarkMode
                        ? "bg-white text-black border-white hover:bg-zinc-100"
                        : "bg-black text-white border-black hover:bg-zinc-900"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>CALIBRATE & SYNC TASK</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Global Glassmorphic Bento Bottom Navigation Tabs */}
        {currentScreen === "dashboard" && (
          <div className="absolute bottom-0 left-0 right-0 h-16 border-t px-6 flex items-center justify-between z-30 transition-colors duration-500 border-transparent">
            {/* Elegant glass blur filter effect backing standard tab layouts */}
            <div className={`absolute inset-0 -z-10 backdrop-blur-md opacity-90 ${isDarkMode ? "bg-black/80" : "bg-white/80"}`} />

            <button
              id="tab-home"
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center space-y-1 relative ${
                activeTab === "home" ? (isDarkMode ? "text-white" : "text-black") : "text-zinc-500"
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[9px] font-mono tracking-widest">DASH</span>
              {activeTab === "home" && (
                <span className={`absolute -bottom-1 w-4 h-[2px] rounded-full ${isDarkMode ? "bg-white" : "bg-black"}`} />
              )}
            </button>

            <button
              id="tab-schedule"
              onClick={() => setActiveTab("schedule")}
              className={`flex flex-col items-center space-y-1 relative ${
                activeTab === "schedule" ? (isDarkMode ? "text-white" : "text-black") : "text-zinc-500"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[9px] font-mono tracking-widest">CHRONO</span>
              {activeTab === "schedule" && (
                <span className={`absolute -bottom-1 w-4 h-[2px] rounded-full ${isDarkMode ? "bg-white" : "bg-black"}`} />
              )}
            </button>

            <button
              id="tab-focus"
              onClick={() => setActiveTab("focus")}
              className={`flex flex-col items-center space-y-1 relative ${
                activeTab === "focus" ? (isDarkMode ? "text-white" : "text-black") : "text-zinc-500"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[9px] font-mono tracking-widest">FOCUS</span>
              {activeTab === "focus" && (
                <span className={`absolute -bottom-1 w-4 h-[2px] rounded-full ${isDarkMode ? "bg-white" : "bg-black"}`} />
              )}
            </button>

            <button
              id="tab-insights"
              onClick={() => setActiveTab("insights")}
              className={`flex flex-col items-center space-y-1 relative ${
                activeTab === "insights" ? (isDarkMode ? "text-white" : "text-black") : "text-zinc-500"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[9px] font-mono tracking-widest">METRICS</span>
              {activeTab === "insights" && (
                <span className={`absolute -bottom-1 w-4 h-[2px] rounded-full ${isDarkMode ? "bg-white" : "bg-black"}`} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
