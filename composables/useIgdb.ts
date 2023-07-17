// @ts-nocheck
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
      first_release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : "?",
      companies: game.involved_companies?.map(
        (inv_comp) => inv_comp.company.name
      ),
      cover: "http:" + game.cover?.url,
    };
  });
};

export const getGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const game = await $fetch("/api/igdb/game", {
    method: "POST",
    body: {
      id: id,
    },
  });

  return {
    ...game,
    release_date: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : "?",
    companies: game.involved_companies?.map(
      (inv_comp) => inv_comp.company.name
    ),
    cover: "http:" + game.cover?.url,
    genres: game.genres.map((genre) => genre.name),
    platforms: game.platforms.map((platform) => {
      return {
        name: platform.abbreviation,
        logo: "http:" + platform.platform_logo?.url,
      };
    }),
    age_ratings: game.age_ratings.map((rating) => {
      return {
        name: rating.rating,
        url: "http:" + rating.rating_cover_url,
      };
    }),
    game_engines: game.game_engines.map(engine => {
        return {
            name: engine.name,
            logo: "http:" + engine.logo.url
        }
    })
  };
};
