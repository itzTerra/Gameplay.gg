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

export const blurIfFocused = (el: Event | EventTarget | null) => {
  if (el instanceof Event) {
    el = el.target;
  }
  if (el != null && (el.matches(":focus") || el === document.activeElement)) {
    setTimeout(function () {
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

export const websiteCatToName = {
  1: "Official",
  2: "Wikia",
  3: "Wikipedia",
  4: "Facebook",
  5: "Twitter",
  6: "Twitch",
  8: "Instagram",
  9: "Youtube",
  10: "iPhone",
  11: "iPad",
  12: "Android",
  13: "Steam",
  14: "Reddit",
  15: "Itch",
  16: "Epic Games",
  17: "GOG",
  18: "Discord",
};
