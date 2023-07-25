export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const res = await $fetch<Record<string, any>[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        headers: await igdbHeaders(event),
        body: `fields ${body.fields.join(", ")}; limit 1; where id = ${
          body.id
        };`,
      }
    );

    return res[0];
  } catch (err) {
    console.error(err);
  }

  event.node.res.statusCode = 400;
  return null;
});
