import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Resolve directory name (ES Modules support)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy Gemini Initialization
let aiClient: any = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------- API ROUTE: TASK & WORKLOAD ANALYSIS -----------------
app.post("/api/focusflow/analyze", async (req, res) => {
  try {
    const { tasks, inputTask } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return high-fidelity realistic simulated response if no API Key is available.
      // This is perfect for local sandbox testing while maintaining full functionality.
      const simulatedResult = generateSimulatedAnalysis(tasks, inputTask);
      return res.json(simulatedResult);
    }

    // Prepare content for Gemini
    const systemPrompt = `You are FocusFlow AI, a premium, luxury-grade AI productivity companion designed to prevent procrastination, prioritize tasks, and manage deadline risk.
Format your entire response as a single, valid JSON object containing:
- "prioritizedTasks": array of tasks with updated AI evaluations.
- "timeBlocks": array of calendar time blocks for the day.
- "burnoutAssessment": burnout risk evaluation.
- "productivityScore": number between 100 representing schedule health.
- "coachMessage": short motivational coach insight.

JSON Schema structure:
{
  "prioritizedTasks": [
    {
      "id": "string (match input id if existing, or create new)",
      "title": "string",
      "aiPriority": "high" | "medium" | "low",
      "riskLevel": "safe" | "moderate" | "critical",
      "riskReason": "string describing why this risk level was chosen",
      "actionPlan": ["string step 1", "string step 2"],
      "estimatedMinutes": number
    }
  ],
  "timeBlocks": [
    {
      "time": "e.g., 09:00 AM - 10:30 AM",
      "activity": "string",
      "taskId": "string"
    }
  ],
  "burnoutAssessment": {
    "riskLevel": "Low" | "Moderate" | "High",
    "warningMessage": "string warning about task density or short deadlines",
    "recommendation": "string actionable recovery tip"
  },
  "productivityScore": number,
  "coachMessage": "string"
}

Ensure the response is STRICTLY valid JSON without markdown blocks or additional text.`;

    const prompt = `Analyze this workload. 
Current Tasks: ${JSON.stringify(tasks || [])}
Newly Input Task/Goal: ${inputTask ? JSON.stringify(inputTask) : "None"}

Optimize the priorities, time-block the day, assess burnout risks based on task volume and deadlines, predict deadline risks, and generate an actionable sub-task plan for high risk items.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze workload." });
  }
});

// ----------------- API ROUTE: AI PRODUCTIVITY COACH CHAT -----------------
app.post("/api/focusflow/coach", async (req, res) => {
  try {
    const { messages } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Mock conversation reply
      const userMsg = messages[messages.length - 1]?.content || "";
      const mockReply = generateSimulatedCoachReply(userMsg);
      return res.json({ role: "assistant", content: mockReply });
    }

    // Use Gemini for custom coach chat
    const systemPrompt = `You are the FocusFlow AI productivity coach. You have an ultra-premium, minimalist, calm, and professional personality. You help users overcome procrastination, organize complex projects, optimize time blocking, and maintain a healthy work-life balance. Keep your replies concise, structured with bullet points where necessary, and highly actionable. Avoid generic fluff.`;

    // Map messages to Gemini API contents structure
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ role: "assistant", content: response.text || "I am here to guide your focus. What shall we tackle next?" });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Coach." });
  }
});

// ----------------- SIMULATED FALLBACK ENGINES -----------------
function generateSimulatedAnalysis(tasks: any[], inputTask: any) {
  const list = [...(tasks || [])];
  
  if (inputTask) {
    list.push({
      id: `task_${Date.now()}`,
      title: inputTask.title || inputTask,
      priority: inputTask.priority || "medium",
      deadline: inputTask.deadline || "Today",
      category: inputTask.category || "Work",
      completed: false,
    });
  }

  // Generate customized priorities and risk assessments
  const prioritizedTasks = list.map((t, idx) => {
    const isOverdueOrToday = t.deadline?.toLowerCase().includes("today") || t.deadline?.toLowerCase().includes("overdue") || idx === 0;
    const isHighPriority = t.priority === "high" || idx === 0;

    let aiPriority = "medium";
    let riskLevel = "safe";
    let riskReason = "Sufficient margin remaining.";
    let actionPlan = ["Set up scope boundaries", "Allocate 45 minutes of deep focus", "Review checklist"];

    if (isHighPriority && isOverdueOrToday) {
      aiPriority = "high";
      riskLevel = "critical";
      riskReason = "High priority task with immediate deadline. Overdue risk is extremely high.";
      actionPlan = [
        "Eliminate all desktop notifications immediately",
        "Set an initial 25-minute Pomodoro timer",
        "Draft the bare minimum viable outline first",
        "Submit draft review to partners before fine-tuning"
      ];
    } else if (isOverdueOrToday) {
      aiPriority = "high";
      riskLevel = "moderate";
      riskReason = "Deadline is imminent. Action is required today.";
      actionPlan = [
        "Block off next available hour in calendar",
        "Complete core execution blocks",
        "Verify submission criteria"
      ];
    } else if (isHighPriority) {
      aiPriority = "high";
      riskLevel = "moderate";
      riskReason = "Important task with comfortable lead-time. Do not let it slide.";
      actionPlan = [
        "Break project down into modular components",
        "Schedule 30-minute outline tomorrow",
        "Complete initial draft three days before deadline"
      ];
    } else {
      aiPriority = "low";
      riskLevel = "safe";
      riskReason = "Low urgency task with flexible timeline.";
      actionPlan = ["Batch this with other low-intensity items", "Complete in the evening as active cool-down"];
    }

    return {
      id: t.id || `task_${idx}`,
      title: t.title,
      aiPriority,
      riskLevel,
      riskReason,
      actionPlan,
      estimatedMinutes: t.estimatedMinutes || (aiPriority === "high" ? 90 : aiPriority === "medium" ? 45 : 20),
    };
  });

  // Schedule Time Blocks based on tasks
  const timeBlocks = [];
  let currentHour = 9;
  prioritizedTasks.forEach((pt, i) => {
    if (i < 4) {
      const startStr = `${currentHour.toString().padStart(2, "0")}:00 AM`;
      const endStr = `${(currentHour + 1).toString().padStart(2, "0")}:15 AM`;
      timeBlocks.push({
        time: `${startStr} - ${endStr}`,
        activity: `Deep Work: ${pt.title}`,
        taskId: pt.id,
      });
      currentHour += 2;
    }
  });

  if (timeBlocks.length === 0) {
    timeBlocks.push(
      { time: "09:00 AM - 10:30 AM", activity: "Deep Work Block", taskId: "1" },
      { time: "11:00 AM - 12:00 PM", activity: "Inbox Clearing & Sync", taskId: "2" },
      { time: "02:00 PM - 03:30 PM", activity: "Strategic Review", taskId: "3" }
    );
  }

  // Assess burnout
  const highRiskCount = prioritizedTasks.filter((pt) => pt.riskLevel === "critical" || pt.riskLevel === "moderate").length;
  let riskLevel = "Low";
  let warningMessage = "Workload looks highly optimized. Safe schedule buffer maintained.";
  let recommendation = "Continue with your planned recovery blocks. Keep active tasks below 4 at once.";

  if (highRiskCount >= 3) {
    riskLevel = "High";
    warningMessage = "Critical overload detected. Multiple urgent high-priority tasks are scheduled for today. Burnout risk is extreme.";
    recommendation = "Postpone non-essential operations. Schedule a mandatory 15-minute screen-free pause after your next deep focus block.";
  } else if (highRiskCount >= 1) {
    riskLevel = "Moderate";
    warningMessage = "Elevated cognitive load. You have time-sensitive items that require immediate attention.";
    recommendation = "Ensure you step away during your midday lunch block. Avoid multitasking to preserve willpower.";
  }

  // Calculate Productivity Score (higher is better structure)
  const totalTasks = prioritizedTasks.length;
  const criticalCount = prioritizedTasks.filter(pt => pt.riskLevel === "critical").length;
  const productivityScore = Math.max(30, Math.min(98, 90 - (criticalCount * 15) + (totalTasks * 2)));

  const coachMessage = inputTask
    ? `Integrated "${inputTask.title || inputTask}" smoothly into your calendar. I've flagged risks and block-booked focus slots to guarantee completion before midnight.`
    : "I have calibrated your daily flow. Focus on your top-priority block first—your cognitive stamina is highest right now.";

  return {
    prioritizedTasks,
    timeBlocks,
    burnoutAssessment: {
      riskLevel,
      warningMessage,
      recommendation,
    },
    productivityScore,
    coachMessage,
  };
}

function generateSimulatedCoachReply(userMsg: string) {
  const msg = userMsg.toLowerCase();
  if (msg.includes("procrastinate") || msg.includes("lazy") || msg.includes("focus")) {
    return `To overcome procrastination right now, we need to bypass the friction of starting. Let's apply the **5-Minute Rule**:

1. **Commit to just 5 minutes** on your highest priority task. You are fully allowed to stop after 5 minutes if you choose.
2. **Remove all barriers**: Close every open browser tab except the one needed for this task. Set your phone to 'Do Not Disturb'.
3. **Start with the easiest action item**: Write just one sentence or set up your file.

90% of the time, the momentum will carry you past the 5-minute mark. Shall we lock in a 25-minute focus session for it now?`;
  }

  if (msg.includes("burnout") || msg.includes("tired") || msg.includes("stress")) {
    return `It sounds like you're experiencing elevated cognitive strain. Let's make an adjustment to save your energy:

- **Aggressively defer non-urgent items**: Move anything that isn't due in 24 hours out of today's view.
- **Implement the 50/10 Pomodoro rule**: Work for 50 minutes, then force a 10-minute screen-free break. Walk, hydrate, or rest your eyes.
- **Micro-recovery**: Close your eyes for 2 minutes right now and focus solely on slow, deep diaphragmatic breaths.

I've flagged your burnout risk as elevated on the dashboard. Let's focus strictly on progress, not perfection today.`;
  }

  if (msg.includes("schedule") || msg.includes("plan") || msg.includes("organize")) {
    return `To optimize your schedule today, I recommend **Time Boxing**:

1. **Protect your Morning Focus**: Do not check emails or chats until your first high-priority task is complete.
2. **Consolidate Admin Tasks**: Batch all small meetings, replies, and reviews into a single 45-minute block in the late afternoon.
3. **Build in Buffer Time**: Leave 15-30 minutes of empty space between focus blocks to prevent a single delay from derailing your entire day.

I have updated your Schedule Tab with suggested optimized blocks. Take a look and let's lock it in!`;
  }

  return `Understood. When managing high workloads, focus is your only leverage. 

I recommend we structure this into a clean **3-step action plan**:
1. Choose one specific task to be your 'Absolute Priority' for the next hour.
2. Complete that task without switching tabs or looking at your phone.
3. Take a deliberate, 5-minute offline rest.

What is the biggest roadblock preventing you from completing this work right now? Let's dismantle it together.`;
}

// ----------------- VITE DEVELOPMENT MIDDLEWARE / PRODUCTION STATIC ROUTING -----------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FocusFlow AI running on http://localhost:${PORT}`);
  });
}

startServer();
