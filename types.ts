export interface StudentState {
  studyHours: number;
  sleepHours: number;
  socialHours: number;
  exerciseHours: number;
  stressLevel: number; // 0-100
  gpa: number; // 0.0 - 4.0
  energy: number; // 0-100
  day: number;
}

// For Graph Nodes
export enum LifeState {
  FRESH = "Fresh",
  TIRED = "Tired",
  STRESSED = "Stressed",
  BURNOUT = "Burnout",
  FLOW = "Flow State",
  BALANCED = "Balanced"
}

// For DP
export interface Task {
  id: string;
  name: string;
  cost: number; // Hours required
  value: number; // Productivity points
}

// For GPA Calculator
export interface GradeEntry {
  id: string;
  name: string; // e.g., "Quiz 1", "Midterm"
  label: string; // "A", "B+"
  value: number; // 4.0, 3.3
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  grades: GradeEntry[];
}