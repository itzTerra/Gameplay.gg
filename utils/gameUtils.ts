import { Timestamp } from "firebase/firestore";

// ############################### INTERFACES, ENUMS, CONSTANTS ##############################

interface Websites {
  url: string;
  category: number;
}

const WEBSITE_CAT_NAME = {
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

const RECOGNIZED_PLATFORMS = [
  "PS3",
  "PS4",
  "PS5",
  "Vita",
  "XONE",
  "Series X",
  "X360",
  "Wii",
  "WiiU",
  "PC",
  "Switch",
  "Linux",
  "Mac",
  "iOS",
  "Android",
  "N64",
  "3DS",
  "browser",
];

const IGDB_DESCRIPTION = "Automatically present from IGDB database."
const IGDB_SUGGESTED = { username: "IGDB", role: 2 };
const IGDB_DATE = Timestamp.fromDate(new Date(2023, 6, 20));
const IGDB_APPROVED = { username: "system", role: 3 };

// ################################### UTIL FUNCTIONS #############################

export const convertWebsites = (websites: Websites[]) => {
  const res: {
    social: any[];
    stores: any[];
    other: any[];
  } = {
    social: [],
    stores: [],
    other: [],
  };

  for (const website of websites) {
    const item = {
      // @ts-ignore
      name: WEBSITE_CAT_NAME[website.category],
      url: website.url,
    };

    if (website.category <= 3) {
      res.other.push(item);
    } else if (
      website.category <= 9 ||
      website.category == 14 ||
      website.category == 18
    ) {
      res.social.push(item);
    } else {
      res.stores.push(item);
    }
  }

  return res;
};

export const sortedCompanies = (companies: Record<string, any>[]) => {
  if (!companies) return;
  companies = companies.filter((comp) => comp.developer);
  companies.sort((a, b) => b.developer - a.developer);
  return companies;
};

export const simplePlatforms = (platforms: { abbreviation: string }[]) => {
  const res: any[] = [];
  if (!platforms) return res;

  for (const platform of platforms) {
    const p = platform.abbreviation;
    if (["PS3", "PS4", "PS5", "Vita"].includes(p)) {
      if (!res.includes("PlayStation")) {
        res.push("PlayStation");
      }
    } else if (["XONE", "Series X", "X360"].includes(p)) {
      if (!res.includes("Xbox")) {
        res.push("Xbox");
      }
    } else if (["Wii", "WiiU"].includes(p)) {
      if (!res.includes("Wii")) {
        res.push("Wii");
      }
    } else if (RECOGNIZED_PLATFORMS.includes(p)) {
      res.push(p);
    }
  }

  return res;
};

/**
 * Used in useFullGame after firestore clips finish loading.
 * If there are videos from IGDB not in firestore, add them to firestore and fills the clips array with them.
 * @param clipArray array of (featured) firestore clips of a game to be filled
 * @param videos IGDB videos
 * @param gameId
 */
export const fillWithIgdb = async (
  clipArray: any[],
  videos: Record<string, any>[],
  gameId: number
) => {
  const { $csrfFetch } = useNuxtApp();
  const cachedClips = getCachedClips();

  const clipsForFirestore: Record<string, any> = {};

  const clipIds = clipArray.map((clip) => clip.id);

  for (const video of videos) {
    if (clipIds.includes(video.video_id)) continue;

    // Applies to frontend and firestore needs
    const clipBase = {
      title: video.name,
      gameId: gameId,
      description: IGDB_DESCRIPTION,
      featured: true,
      likes: 0,
    };

    // Server will fill in more data
    clipsForFirestore[video.video_id] = clipBase;

    const returnClip = {
      ...clipBase,
      suggested: IGDB_SUGGESTED,
      dateSuggested: getTimeDifference(IGDB_DATE),
      approved: IGDB_APPROVED,
      dateApproved: getTimeDifference(IGDB_DATE),
      suggestedLoaded: true,
    };

    cachedClips.value[video.video_id] = returnClip;
    clipArray.push(returnClip);
  }

  if (clipsForFirestore) {
    // @ts-ignore
    $csrfFetch("/api/firestore/addIgdbClips", {
      method: "POST",
      body: {
        gameId: gameId.toString(),
        clips: clipsForFirestore,
      },
    }).catch((err: any) => {
      console.error(err);
    });
  }
};

