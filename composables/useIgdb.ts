// @ts-nocheck

const sortedCompanies = (companies) => {
  if (!companies) return;
  companies = companies.filter((comp) => comp.developer);
  companies.sort((a, b) => b.developer - a.developer);
  return companies;
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

const simplePlatforms = (platforms) => {
  const res = [];
  platforms.forEach((p) => {
    p = p.abbreviation;
    if (["PS3", "PS4", "PS5"].includes(p)) {
      if (!res.includes("PlayStation")) {
        res.push("PlayStation");
      }
    } else if (["XONE", "Series X", "X360"].includes(p)) {
      if (!res.includes("Xbox")) {
        res.push("Xbox");
      }
    } else {
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
      first_release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : "?",
      companies: sortedCompanies(game.involved_companies)?.map(
        (inv_comp) => inv_comp.company.name
      ),
      cover: "http:" + game.cover?.url,
    };
  });
};

export const getGame = async (id: number | string) => {
  const $csrfFetch = useNuxtApp().$csrfFetch;

  const game = await $csrfFetch("/api/igdb/game", {
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
    companies: sortedCompanies(game.involved_companies)?.map(
      (inv_comp) => inv_comp.company.name
    ),
    cover: "http:" + game.cover?.url,
    genres: game.genres.map((genre) => genre.name),
    platforms: simplePlatforms(game.platforms),
    websites: convertWebsites(game.websites),
  };
};
