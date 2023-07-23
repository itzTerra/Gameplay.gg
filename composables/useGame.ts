// @ts-nocheck
import { getDoc, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const sortedCompanies = (companies) => {
  if (!companies) return;
  companies = companies.filter((comp) => comp.developer);
  companies.sort((a, b) => b.developer - a.developer);
  return companies;
};

const websiteCatToName = {
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

const convertWebsites = (websites) => {
  const res = {
    social: [],
    stores: [],
    other: [],
  };

  websites.forEach((w) => {
    const item = { name: websiteCatToName[w.category], url: w.url };
    if (w.category <= 3) {
      res.other.push(item);
    } else if (w.category <= 9 || w.category == 14 || w.category == 18) {
      res.social.push(item);
    } else {
      res.stores.push(item);
    }
  });

  return res;
};

const recognizedPlatforms = [
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

const simplePlatforms = (platforms) => {
  const res = [];
  platforms.forEach((p) => {
    p = p.abbreviation;
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
    } else if (recognizedPlatforms.includes(p)) {
      res.push(p);
    }
  });
  return res;
};

export const searchGames = async (query: string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const res = await $csrfFetch("/api/igdb/search", {
    method: "POST",
    body: {
      query: query,
    },
  });

  return res.map((game) => {
    return {
      ...game,
      release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : "?",
      companies: sortedCompanies(game.involved_companies)?.map(
        (inv_comp) => inv_comp.company.name
      ),
      cover: game.cover ? "http:" + game.cover.url : null,
    };
  });
};

const fillWithIgdb = async (clipArray, videos, gameId) => {
  const firestore = useNuxtApp().$firestore;
  const cachedClips = getCachedClips();
  const dictionary = {};

  for (const clip of clipArray) {
    dictionary[clip.id] = clip;
  }

  const igdbUserRef = doc(firestore, "users", "IGDB");
  const systemUserRef = doc(firestore, "users", "system");

  for (const video of videos) {
    if (!dictionary.hasOwnProperty(video.video_id)) {
      const newClip = {
        game_id: gameId,
        title: video.name,
        suggested: igdbUserRef,
        approved: systemUserRef,
        featured: true,
        likes: 0,
      };
      const docRef = doc(firestore, "clips", video.video_id);
      await setDoc(docRef, newClip);
      await updateDoc(doc(firestore, "games", gameId.toString()), {
        featured: arrayUnion(docRef),
      });
      newClip.id = video.video_id;
      cachedClips.value[video.video_id] = newClip;
      dictionary[video.video_id] = newClip;
    }
  }

  // Extract the filled array from the dictionary
  const clips = Object.values(dictionary);

  return clips;
};

export const getGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const game = await $csrfFetch("/api/igdb/game", {
    method: "POST",
    body: {
      id: id,
    },
  });

  const clipsRes = await getClips(game.id, (featured) => {
    if (game.videos) {
        fillWithIgdb(featured, game.videos, game.id);
      }
  });

  return {
    ...game,
    release_date: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : "?",
    companies: sortedCompanies(game.involved_companies)?.map(
      (inv_comp) => inv_comp.company.name
    ),
    cover: "http:" + game.cover?.url,
    genres: game.genres.map((genre) => genre.name),
    platforms: simplePlatforms(game.platforms),
    websites: convertWebsites(game.websites),
    videos: game.videos?.map((video) => {
      return { id: video.video_id, title: video.name };
    }),
    clips: clipsRes,
  };
};
