import { BookOpen, GraduationCap, Heart, Home, LucideIcon, Users, User } from 'lucide-react';

export type Persona = {
  key: string;
  name: string;
  icon: LucideIcon;
  promptRole: 'Brother' | 'Friend' | 'Girlfriend' | 'Mother' | 'Father';
  initialMessage: string;
  avatar: string;
};

export const personas: Record<string, Persona> = {
  brother: {
    key: 'brother',
    name: 'Your Brother',
    icon: Users,
    promptRole: 'Brother',
    initialMessage: "What's up? Need to talk about something or just chill?",
    avatar: 'https://placehold.co/100x100.png',
  },
  friend: {
    key: 'friend',
    name: 'Your Friend',
    icon: User,
    promptRole: 'Friend',
    initialMessage: "Hey buddy! How's it going? Anything new and exciting happening?",
    avatar: 'https://placehold.co/100x100.png',
  },
  girlfriend: {
    key: 'girlfriend',
    name: 'Your Girlfriend ❤️',
    icon: Heart,
    promptRole: 'Girlfriend',
    initialMessage: 'Heyy! I was just thinking about you. How was your day, Ji?',
    avatar: 'https://placehold.co/100x100.png',
  },
  mother: {
    key: 'mother',
    name: 'Your Mother',
    icon: Home,
    promptRole: 'Mother',
    initialMessage: 'Hi beta, have you eaten? I was just worried about you. Everything okay?',
    avatar: 'https://placehold.co/100x100.png',
  },
  father: {
    key: 'father',
    name: 'Your Father',
    icon: BookOpen,
    promptRole: 'Father',
    initialMessage: "Son, how are things? Remember to stand tall. Let's talk.",
    avatar: 'https://placehold.co/100x100.png',
  },
};

export const personaKeys = Object.keys(personas);
