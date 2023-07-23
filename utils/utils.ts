// @ts-nocheck

import {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  animals,
} from "unique-names-generator";

export const generateUsername = () => {
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const generated_name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "",
    style: "capital",
  });

  return generated_name;
};

// Check if the device is handheld
export const isHandheldDevice = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
});

// For dropdowns
export const blurIfFocused = (el: Event | EventTarget | null) => {
  if (el instanceof Event) {
    el = el.target;
  }
  if (el != null && (el.matches(":focus") || el === document.activeElement)) {
    setTimeout(() => {
      el.blur();
    }, 0);
  }
};

export enum UserRole {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  OWNER = 3,
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ClipData {
  approved: DocumentReference;
  game_id: number;
  featured: boolean;
  likes: number;
  suggested: DocumentReference;
  title: string;
}
