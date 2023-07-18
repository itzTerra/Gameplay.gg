export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let r = await $fetch<Record<string, any>[]>("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: await igdbHeaders(event),
    body: `search "${body.query}"; fields name, cover.url, first_release_date, involved_companies.developer, involved_companies.company.name; limit 10; where version_parent = null & category = (0, 4, 8, 9, 10) & (involved_companies = null | involved_companies.developer=true | involved_companies.publisher=true);`,
  });

  return r;
});
