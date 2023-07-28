export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (!body.count || !body.minRating || !body.fields) throw new Error("bad arguments")

    const res = await $fetch<Record<string, any>[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        headers: await igdbHeaders(event),
        body: 
        `
        fields ${body.fields.join(", ")}; 
        where total_rating >= ${body.minRating} & release_dates.date != null & release_dates.date < ${Math.floor(Date.now() / 1000)};
        sort release_dates.date desc, rating desc;
        limit ${body.count}; 
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
