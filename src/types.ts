export interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  category: "Work" | "Study" | "Project" | "Personal";
  completed: boolean;
  aiPriority?: "high" | "medium" | "low";
  riskLevel?: "safe" | "moderate" | "critical";
  riskReason?: string;
  actionPlan?: string[];
  estimatedMinutes?: number;
}

export interface TimeBlock {
  time: string;
  activity: string;
  taskId?: string;
}

export interface BurnoutAssessment {
  riskLevel: "Low" | "Moderate" | "High";
  warningMessage: string;
  recommendation: string;
}

export interface FocusSession {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  timestamp: string;
}

export interface Goal {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  period: "daily" | "weekly";
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  prioritizedTasks: {
    id: string;
    title: string;
    aiPriority: "high" | "medium" | "low";
    riskLevel: "safe" | "moderate" | "critical";
    riskReason: string;
    actionPlan: string[];
    estimatedMinutes: number;
  }[];
  timeBlocks: TimeBlock[];
  burnoutAssessment: BurnoutAssessment;
  productivityScore: number;
  coachMessage: string;
}
