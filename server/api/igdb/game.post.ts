export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let r = await $fetch<Record<string, any>[]>("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: await igdbHeaders(event),
    body: `fields name, summary, cover.url, first_release_date, involved_companies.developer, involved_companies.company.name, genres.name, platforms.abbreviation, total_rating, game_engines.name, videos.name, videos.video_id, websites.url, websites.category; limit 1; where id = ${body.id};`,
  });

  return r[0];
});
