export interface DemoUserSeedEntry {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
}

export const DEMO_USERS_SEED: DemoUserSeedEntry[] = [
  {
    fullName: 'Demo Rider',
    email: 'rider@nittojatra.com',
    phone: '+8801711111111',
    password: 'Demo1234!',
    gender: 'male',
  },
  {
    fullName: 'Demo Captain',
    email: 'captain@nittojatra.com',
    phone: '+8801722222222',
    password: 'Demo1234!',
    gender: 'male',
  },
];
