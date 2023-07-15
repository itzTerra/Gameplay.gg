import { apicalypse } from "apicalypse";

export default async () => {
    const config = useRuntimeConfig();
    const accessTokenData = await useTwitchToken();
    
    const requestOptions = computed(() => {
      return {
        method: "post", // The default is `get`
        baseURL: "https://api.igdb.com/v4",
        headers: {
          "Client-ID": config.public.twitchDbClientId,
          Authorization: "Bearer " + accessTokenData.value.token,
        },
      };
    });
    
    const getCompanies = async (ids: number[]) => {
      const res = await apicalypse(requestOptions)
        .fields("company, developer, publisher")
        .limit(10)
        .where([`id = (${ids.toString().slice(1, -1)})`, `developer = true | publisher = true;`])
        .request("/involved_companies");
    
      const companies: { name: string; role: string; }[] = [];
      res.data.forEach(async (company: any) => {
        let compName = await apicalypse(requestOptions)
          .fields("name")
          .where("id = " + company.company)
          .request("/companies");
        companies.push({
          name: compName.data.name,
          role: company.developer ? "Developer" : "Publisher",
        });
      });
      return companies;
    };
    
    const search = async (query: string) => {
      const res = await apicalypse(requestOptions)
        .fields("name, first_release_date, involved_companies")
        .limit(5)
        .search(query)
        .request("/games");
    
      console.log(res.data);
      console.log(await getCompanies(res.involved_companies))
    };

    return {search}
}

