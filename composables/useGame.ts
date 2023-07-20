// @ts-nocheck
import { getDoc, doc } from "firebase/firestore";

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

const getClips = async (id) => {
  let featured = [];
  let approved = [];
  const cachedClips = getCachedClips();

  let cached = true

  if (cachedClips.value) {
    for (clip of Object.values(cachedClips.value)){
        if (clip.game_id != id){
            cached = false
            break
        }

        if (clip.featured){
            featured.push(clip);
        } else {
            approved.push(clip);
        }
    }
  } else if (!cached){
    const firestore = useNuxtApp().$firestore;
    // Get firestore user-data
    const firestoreData = (
      await getDoc(doc(firestore, "games", id.toString())).catch(() => null)
    )?.data();

    if (firestoreData) {
      cachedClips.value.id = id;

      for (const docRef of firestoreData.featured) {
        const clip = (await getDoc(docRef).catch(() => null))?.data();
        if (clip) {
          clip.id = docRef.id;
          featured.push(clip);
          cachedClips.value.push(clip);
        }
      }

      for (const docRef of firestoreData.approved) {
        const clip = (await getDoc(docRef).catch(() => null))?.data();
        if (clip) {
          clip.id = docRef.id;
          approved.push(clip);
          cachedClips.value.push(clip);
        }
      }
    }
  }

  return { featured, approved };
};

export const getGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const game = await $csrfFetch("/api/igdb/game", {
    method: "POST",
    body: {
      id: id,
    },
  });

  const { featured: featuredClips, approved: approvedClips } = await getClips(
    game.id
  );

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
    featuredClips: featuredClips.concat(
      game.videos?.map((video) => {
        return { id: video.video_id, title: video.name };
      }) || []
    ),
    approvedClips: approvedClips,
  };
};
