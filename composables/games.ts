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
  const newGames = ref<any>([]);
  const hasMore = ref(true);

  const offset = ref(0);

  const queryGames = async (count: number) => {
    try {
      const games = await $fetch("/api/igdb/newgames", {
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
      }) as Record<string, any>[];

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

/**
 * Used in game detail view to get data from IGDB.
 * @param id game id
 * @returns reactive game data object
 */
export const useFullGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const game = ref<Record<string, any>>({});

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
  const gameData = gamesArray[0];

  const clipsRes = await useGameClips(gameData.id, async (featured: any[]) => {
    if (gameData.videos) {
      fillWithIgdb(featured, gameData.videos, gameData.id);
    }
  });

  game.value = {
    ...gameData,
    release_date: gameData.first_release_date
      ? new Date(gameData.first_release_date * 1000).getFullYear()
      : "?",
    companies: sortedCompanies(gameData.involved_companies)?.map(
      (inv_comp) => inv_comp.company.name
    ),
    genres: gameData.genres.map((genre: Record<string, any>) => genre.name),
    platforms: simplePlatforms(gameData.platforms),
    websites: convertWebsites(gameData.websites),
    videos: gameData.videos?.map((video: Record<string, any>) => {
      return { id: video.video_id, title: video.name };
    }),
    clips: clipsRes,
  };

  return game;
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
 * Used in usePopularClips in index view to get the game info for each clip.
 * @param ids ids of needed games
 * @returns game data object
 */
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
