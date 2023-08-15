import { type DocumentReference, type Timestamp } from "firebase/firestore";
import {
  type Timestamp as AdminTimestamp,
  type DocumentReference as AdminDocumentReference,
} from "firebase-admin/firestore";
import {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  animals,
} from "unique-names-generator";

// ############################### INTERFACES, ENUMS, CONSTANTS ##############################

export interface UserData {
  username: string;
  role: number;
  likedClips: string[];
  suggestedClips: string[];
  approvedClips: string[];
  rejectedClips: string[];
}

export enum UserRole {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  OWNER = 3,
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ################################### UTIL FUNCTIONS #############################

export function isObjectEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}

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

  if (!(el instanceof Element)) return;

  if (el.matches(":focus") || el === document.activeElement) {
    setTimeout(() => {
      // @ts-ignore
      el.blur();
    }, 0);
  }
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const timeSecondsOrNull = (timeString: string) => {
  if (timeString === "") return null;

  if (!isNaN(Number(timeString))) {
    // If the timeString is already a number, return it directly
    return Number(timeString);
  } else {
    // Split the timeString by ":" and convert each part to a number
    let parts;
    try {
      parts = timeString.split(":").map(Number);
    } catch {
      return null;
    }

    // Calculate the total seconds from the parts
    let totalSeconds = 0;

    // Based on the number of parts present, calculate the total seconds
    if (parts.length == 3) {
      totalSeconds += parts[0] * 3600; // Hours to seconds
      totalSeconds += parts[1] * 60; // Minutes to seconds
      totalSeconds += parts[2]; // Seconds
    } else if (parts.length == 2) {
      totalSeconds += parts[0] * 60; // Minutes to seconds
      totalSeconds += parts[1]; // Seconds
    } else if (parts.length == 1) {
      totalSeconds += parts[0]; // Seconds
    } else {
      return null;
    }

    return totalSeconds;
  }
};

export const secToTimeString = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const timeStringParts = [hours, minutes, remainingSeconds].map((part) =>
    part.toString().padStart(2, "0")
  );

  if (hours > 0) {
    return `${timeStringParts[0]}:${timeStringParts[1]}:${timeStringParts[2]}`;
  } else {
    return `${timeStringParts[1]}:${timeStringParts[2]}`;
  }
};

export const getTimeDifference = (timestamp: Timestamp | AdminTimestamp) => {
  const now = Date.now();
  const timeDiffInSeconds = Math.floor((now - timestamp.toMillis()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30 * secondsInDay; // Assuming 30 days in a month for simplicity
  const secondsInYear = 365 * secondsInDay; // Assuming 365 days in a year for simplicity

  const years = Math.floor(timeDiffInSeconds / secondsInYear);
  const months = Math.floor(timeDiffInSeconds / secondsInMonth);
  const days = Math.floor(timeDiffInSeconds / secondsInDay);
  const hours = Math.floor(timeDiffInSeconds / secondsInHour);

  if (years >= 1) {
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  } else if (months >= 1) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else if (days >= 1) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (hours >= 1) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    return "Less than an hour ago";
  }
};

export const getLongDateString = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth();

  const suffixes = ["st", "nd", "rd"];
  let suffix = "th";
  if (day < 11 || day > 13) {
    suffix = suffixes[(day % 10) - 1] || "th";
  }

  return `${MONTH_NAMES[month]} ${day}${suffix}`;
};
