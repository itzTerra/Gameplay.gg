export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let r = await $fetch<Record<string, any>[]>("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: await igdbHeaders(event),
    body: `search "${body.query}"; fields name, cover, first_release_date, involved_companies.company.name, slug; limit 5; where version_parent = null & category = (0, 1, 2, 8, 9, 10) & (involved_companies.developer=true | involved_companies.publisher=true);`,
  });

  console.log(r);

  return r;
});
