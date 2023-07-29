export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (!body.limit || !body.minRating || !body.fields) throw new Error("bad arguments")

    const res = await $fetch<Record<string, any>[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        headers: await igdbHeaders(event),
        body: 
        `
        fields ${body.fields.join(", ")}; 
        where total_rating_count > 5 & total_rating >= ${body.minRating} & first_release_date != null & first_release_date < ${Math.floor(Date.now() / 1000)};
        sort first_release_date desc;
        limit ${body.limit};
        ${body.offset ? `offset ${body.offset};` : ''}
        `,
      }
    );

    return res;
  } catch (err) {
    console.error(err);
  }

  event.node.res.statusCode = 400;
  return null;
});
