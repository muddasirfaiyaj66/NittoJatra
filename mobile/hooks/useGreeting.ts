import { Strings } from '@/constants/strings';

export interface Greeting {
  en: string;
  bn: string;
  emoji: string;
}

export function getGreeting(date: Date = new Date()): Greeting {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return { en: Strings.greetingMorning.en, bn: Strings.greetingMorning.bn, emoji: '🌤️' };
  }
  if (hour >= 12 && hour < 17) {
    return { en: Strings.greetingAfternoon.en, bn: Strings.greetingAfternoon.bn, emoji: '☀️' };
  }
  if (hour >= 17 && hour < 21) {
    return { en: Strings.greetingEvening.en, bn: Strings.greetingEvening.bn, emoji: '🌆' };
  }
  return { en: Strings.greetingNight.en, bn: Strings.greetingNight.bn, emoji: '🌙' };
}
