export default defineEventHandler(async (event) => {
    const body = await readBody(event);
  
    let r = await $fetch<Record<string, any>[]>("https://api.igdb.com/v4/involved_companies", {
      method: "POST",
      headers: await igdbHeaders(event),
      body: `search "${body.query}"; fields name, cover, first_release_date, involved_companies, slug; limit 5; where version_parent = null & category = (0, 1, 2, 8, 9, 10);`,
    });
  
    console.log(r);
  
    return r

    const res = await apicalypse((await requestOptions()) as ApicalypseConfig)
    .fields("company, developer, publisher")
    .limit(10)
    .where([
      `id = (${ids.toString().slice(1, -1)})`,
      `developer = true | publisher = true;`,
    ])
    .request("/involved_companies");

  const companies: { name: string; role: string }[] = [];
  res.data.forEach(async (company: any) => {
    let compName = await apicalypse(
      (await requestOptions()) as ApicalypseConfig
    )
      .fields("name")
      .where("id = " + company.company)
      .request("/companies");
    companies.push({
      name: compName.data.name,
      role: company.developer ? "Developer" : "Publisher",
    });
  });
  return companies;
  });
  