export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (!body.ids || !body.fields) throw new Error("bad arguments")

    const res = await $fetch<Record<string, any>[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        headers: await igdbHeaders(event),
        body: `fields ${body.fields.join(
          ", "
        )}; limit ${body.ids.length}; where id = (${body.ids.join(",")});`,
      }
    );

    return res;
  } catch (err) {
    console.error(err);
  }

  event.node.res.statusCode = 400;
  return null;
});
