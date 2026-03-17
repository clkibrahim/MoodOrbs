export type MoodKey = "calm" | "joy" | "hype" | "sad" | "empty";

export interface MoodDistributionItem {
  label: string;
  pct: number;
  color: string;
}

export interface DayData {
  day: number;
  mood: MoodKey;
  distribution?: MoodDistributionItem[];
  summary?: string;
}

export interface MoodConfig {
  color: string;
  orb: any;
}
