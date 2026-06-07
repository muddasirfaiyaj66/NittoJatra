export type Lang = 'en' | 'bn';

export const Strings = {
  appName: { en: 'NittoJatra', bn: 'নিত্যযাত্রা' },
  tagline: {
    en: 'Your daily commute, simple and safe',
    bn: 'আপনার দৈনন্দিন যাত্রা, সহজ ও নিরাপদ',
  },
  login: { en: 'Login', bn: 'লগইন' },
  register: { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' },
  continueGuest: { en: 'Continue as Guest', bn: 'অতিথি হিসেবে চালিয়ে যান' },
  email: { en: 'Email', bn: 'ইমেইল' },
  password: { en: 'Password', bn: 'পাসওয়ার্ড' },
  confirmPassword: { en: 'Confirm Password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' },
  fullName: { en: 'Full Name', bn: 'পুরো নাম' },
  phone: { en: 'Phone Number', bn: 'ফোন নম্বর' },
  forgotPassword: { en: 'Forgot Password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' },
  noAccount: { en: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?' },
  haveAccount: { en: 'Already have an account?', bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে?' },
  searchRides: { en: 'Search Rides', bn: 'রাইড খুঁজুন' },
  from: { en: 'From', bn: 'থেকে' },
  to: { en: 'To', bn: 'গন্তব্য' },
  popularRoutes: { en: 'Popular Routes', bn: 'জনপ্রিয় রুট' },
  upcomingTrips: { en: 'Upcoming Trips', bn: 'আসন্ন যাত্রা' },
  noUpcomingTrips: { en: 'No upcoming trips', bn: 'কোনো আসন্ন যাত্রা নেই' },
  bookNow: { en: 'BOOK NOW', bn: 'এখনই বুক করুন' },
  greetingMorning: { en: 'Good Morning', bn: 'শুভ সকাল' },
  greetingAfternoon: { en: 'Good Afternoon', bn: 'শুভ অপরাহ্ন' },
  greetingEvening: { en: 'Good Evening', bn: 'শুভ সন্ধ্যা' },
  greetingNight: { en: 'Good Night', bn: 'শুভ রাত্রি' },
  bookings: { en: 'Bookings', bn: 'বুকিং' },
  profile: { en: 'Profile', bn: 'প্রোফাইল' },
  search: { en: 'Search', bn: 'অনুসন্ধান' },
  home: { en: 'Home', bn: 'হোম' },
  logout: { en: 'Logout', bn: 'লগআউট' },
} as const;

export type StringKey = keyof typeof Strings;

export const t = (key: StringKey, lang: Lang = 'en'): string => Strings[key][lang];
