import { MoodKey, MoodConfig, DayData, MoodDistributionItem } from "../types/mood";

/* ─────────────────────────────────────────────────
   Mood Config — orb asset + renk
   ───────────────────────────────────────────────── */

export const MOOD_CONFIG: Record<MoodKey, MoodConfig> = {
  calm:  { color: "#9747FF", orb: require("../../assets/Dreamy.png") },
  joy:   { color: "#FFB347", orb: require("../../assets/Happy.png") },
  hype:  { color: "#FF5C5C", orb: require("../../assets/Hype.png") },
  sad:   { color: "#5BA4CF", orb: require("../../assets/Melancholic.png") },
  empty: { color: "transparent", orb: null },
};

/* ─────────────────────────────────────────────────
   Today Mock Verisi
   ───────────────────────────────────────────────── */

export const TODAY_DISTRIBUTION: (MoodDistributionItem & { key: MoodKey; orb: any })[] = [
  { key: "calm",  label: "Calm",  pct: 45, color: "#9747FF", orb: require("../../assets/Dreamy.png") },
  { key: "joy",   label: "Joy",   pct: 25, color: "#FFB347", orb: require("../../assets/Happy.png") },
  { key: "hype",  label: "Hype",  pct: 20, color: "#FF5C5C", orb: require("../../assets/Hype.png") },
  { key: "sad",   label: "Sad",   pct: 10, color: "#5BA4CF", orb: require("../../assets/Melancholic.png") },
];

export const TODAY_TIMELINE: { period: string; color: string; orb: any }[] = [
  { period: "Morning",   color: "#FFB347", orb: require("../../assets/Happy.png") },
  { period: "Afternoon", color: "#FF5C5C", orb: require("../../assets/Hype.png") },
  { period: "Evening",   color: "#9747FF", orb: require("../../assets/Dreamy.png") },
  { period: "Night",     color: "#5BA4CF", orb: require("../../assets/Melancholic.png") },
];

/* ─────────────────────────────────────────────────
   Timeline Mock Verisi (Haziran 2025)
   ───────────────────────────────────────────────── */

const DAYS_IN_MONTH = 30;
const FIRST_DAY_OFFSET = 0; // Haziran 1 = Pazar

const MOODS: MoodKey[] = [
  "joy","hype","calm","calm","sad","joy","hype",
  "calm","calm","joy","hype","hype","sad","calm",
  "joy","joy","calm","hype","sad","sad","calm",
  "joy","hype","calm","calm","joy","sad","hype",
  "calm","joy",
];

function buildDistribution(mood: MoodKey): MoodDistributionItem[] {
  return [
    { label: "Calm",  pct: mood === "calm"  ? 45 : 20, color: "#9747FF" },
    { label: "Joy",   pct: mood === "joy"   ? 40 : 25, color: "#FFB347" },
    { label: "Hype",  pct: mood === "hype"  ? 45 : 15, color: "#FF5C5C" },
    { label: "Sad",   pct: mood === "sad"   ? 50 : 10, color: "#5BA4CF" },
  ];
}

const MOOD_SUMMARIES: Record<MoodKey, string> = {
  calm:  "A peaceful day with dreamy, relaxed sounds.",
  joy:   "High spirits! Upbeat and cheerful music all day.",
  hype:  "High energy — you were on fire today!",
  sad:   "A reflective, melancholic mood through the day.",
  empty: "",
};

export function buildCalendar(): DayData[] {
  const days: DayData[] = [];
  for (let i = 0; i < FIRST_DAY_OFFSET; i++) {
    days.push({ day: 0, mood: "empty" });
  }
  for (let d = 1; d <= DAYS_IN_MONTH; d++) {
    const mood = MOODS[d - 1];
    days.push({
      day: d,
      mood,
      distribution: buildDistribution(mood),
      summary: MOOD_SUMMARIES[mood],
    });
  }
  return days;
}
