import { Timestamp } from "firebase/firestore";
// import {
//   convertWebsites,
//   simplePlatforms,
//   sortedCompanies,
// } from "utils/gameUtils";

// ####################################### COMPOSABLES ######################################

/**
 * Used in index view to show IGDB games (with respectable rating) ordered by release date (but not TBD or upcoming).
 * @param gamesPerPage number of games to load, default 8
 * @param minRating minimum game's rating, default 70
 * @returns
 * - reactive array of all games
 * - function to load another page of games
 * - reactive hasMore boolean to check if there are more pages to load
 */
export const useNewGames = async (
  gamesPerPage: number = 8,
  minRating: number = 70
) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const newGames = ref<any>([]);
  const hasMore = ref(true);

  const offset = ref(0);

  const queryGames = async (count: number) => {
    try {
      // @ts-ignore
      const games = await $csrfFetch("/api/igdb/newgames", {
        method: "POST",
        body: {
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
        },
      });

      if (games.length < count) {
        hasMore.value = false;
      }

      for (let game of games) {
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

// ################################## FUNCTIONS USED IN VIEWS ##################################

/**
 * Used for Search component (navbar game search and in suggest)
 * @param query string to pass to IGDB search API
 * @returns game info
 */
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

/**
 * Used in getFullGame after firestore clips finish loading. 
 * If there are videos from IGDB not in firestore, add them to firestore and fills the clips array with them.
 * @param clipArray array of (featured) firestore clips of a game to be filled
 * @param videos IGDB videos
 * @param gameId 
 */
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
      gameId: gameId,
      description: "Automatically present from IGDB database.",
      featured: true,
      suggested: { username: "IGDB", role: 2 },
      dateSuggested: Timestamp.fromDate(new Date(2023, 6, 20)),
      approved: { username: "system", role: 3 },
      dateApproved: Timestamp.fromDate(new Date(2023, 6, 20)),
      likes: 0,
    };
    clipsForFirestore[video.video_id] = firestoreClip;

    const returnClip = {
      ...firestoreClip,
      dateSuggested: getTimeDifference(firestoreClip.dateSuggested),
    //   TODO: dateApproved
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

export const getFullGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  // @ts-ignore
  const gamesArray = await $csrfFetch("/api/igdb/games", {
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
  });
  const game = gamesArray[0];

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
