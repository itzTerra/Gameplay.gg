import { Timestamp } from "firebase/firestore";
import { ApprovedClip } from "utils/utils";

const sortedCompanies = (companies: Record<string, any>[]) => {
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

interface Websites {
    url: string,
    category: number
}

const convertWebsites = (websites: Websites[]) => {
  const res:{
    social: any[];
    stores: any[];
    other: any[];
  } = {
    social: [],
    stores: [],
    other: [],
  };

  for (const website of websites){
    const item = { 
        // @ts-ignore
        name: websiteCatToName[website.category], 
        url: website.url 
    };

    if (website.category <= 3) {
      res.other.push(item);
    } else if (website.category <= 9 || website.category == 14 || website.category == 18) {
      res.social.push(item);
    } else {
      res.stores.push(item);
    }
  };

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

const simplePlatforms = (platforms: {abbreviation: string}[]) => {
  const res: any[] = [];
  if (!platforms) return res;

  for (const platform of platforms){
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
    } else if (recognizedPlatforms.includes(p)) {
      res.push(p);
    }
  };

  return res;
};

export const searchGames = async (query: string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  // @ts-ignore
  const res = await $csrfFetch("/api/igdb/search", {
    method: "POST",
    body: {
      query: query,
    },
  });

  return res.map((game: Record<string, any>) => {
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

const fillWithIgdb = async (
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

    const firestoreClip = {
      title: video.name,
      game_id: gameId,
      featured: true,
      suggested: { username: "IGDB", role: 2 },
      date_suggested: Timestamp.fromDate(new Date(2023, 6, 20)),
      approved: { username: "system", role: 3 },
      date_approved: Timestamp.fromDate(new Date(2023, 6, 20)),
      likes: 0,
    };
    clipsForFirestore[video.video_id] = firestoreClip;

    const returnClip = {
        ...firestoreClip,
        date_suggested: getTimeDifference(firestoreClip.date_suggested),
        suggestedLoaded: true
    }
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

export const getFullGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const game = 
  (
    // @ts-ignore
    await $csrfFetch("/api/igdb/games", {
      method: "POST",
      body: {
        ids: [id],
        fields: [
          "name",
          "summary",
          "first_release_date",
          "involved_companies.developer",
          "involved_companies.company.name",
          "genres.name",
          "platforms.abbreviation",
          "total_rating",
          "game_engines.name",
          "videos.name",
          "videos.video_id",
          "websites.url",
          "websites.category",
        ],
      },
    })
  )[0];
  // console.log(getCachedClips().value)

  const clipsRes = await useGameClips(game.id, async (featured: any[]) => {
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
    genres: game.genres.map((genre: Record<string, any>) => genre.name),
    platforms: simplePlatforms(game.platforms),
    websites: convertWebsites(game.websites),
    videos: game.videos?.map((video: Record<string, any>) => {
      return { id: video.video_id, title: video.name };
    }),
    clips: clipsRes,
  };
};

export const getShortGames = async (ids: number[]) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  // @ts-ignore
  const games = await $csrfFetch("/api/igdb/games", {
    method: "POST",
    body: {
      ids: ids,
      fields: [
        "name",
        "cover.url",
        "first_release_date",
        "involved_companies.developer",
        "involved_companies.company.name",
      ],
    },
  });

  if (!games) return null;

  return games.map((game: Record<string, any>) => {
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

export const useNewGames = async (gamesPerPage: number, minRating: number) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const newGames = ref<any>([]);
  const hasMore = ref(true);

  const offset = ref(0);

  const queryGames = async (count: number) => {
    try {
        const body = {
            minRating: minRating,
            fields: [
              "name",
              "first_release_date",
              "artworks.image_id",
              "artworks.width",
              "artworks.height",
              "total_rating",
              "platforms.abbreviation",
              "genres.name",
            ],
            limit: count,
            offset: offset.value,
          }
        console.log(body)
      // @ts-ignore
      const res = await $csrfFetch("/api/igdb/newgames", {
        method: "POST",
        body: body,
      });

      if (res.length < count) {
        hasMore.value = false;
      }

      for (let game of res) {
        game = {
          ...game,
          release_date: getLongDateString(
            new Date(game.first_release_date * 1000)
          ),
          genres: game.genres.map((genre: Record<string, any>) => genre.name),
          platforms: simplePlatforms(game.platforms),
        };

        newGames.value.push(game);
      }

      offset.value += count;
    } catch (err) {
      console.error(err);
    }
  };

  queryGames(gamesPerPage);

  return { newGames, queryGames, hasMore };
};
