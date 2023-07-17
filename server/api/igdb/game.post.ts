export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let r = await $fetch<Record<string, any>[]>("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: await igdbHeaders(event),
    body: `fields name, summary, cover.url, first_release_date, involved_companies.company.name, genres.name, platforms.abbreviation, platforms.platform_logo.url, age_ratings.rating, age_ratings.rating_cover_url, total_rating, game_engines.name, game_engines.logo.url, videos, websites.url, websites.category; limit 1; where id = ${body.id};`,
  });

  return r[0];
});
