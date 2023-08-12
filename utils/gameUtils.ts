export const sortedCompanies = (companies: Record<string, any>[]) => {
  if (!companies) return;
  companies = companies.filter((comp) => comp.developer);
  companies.sort((a, b) => b.developer - a.developer);
  return companies;
};

const websiteCatToName = {
  1: "Official",
  2: "Wikia",
  3: "Wikipedia",
  4: "Facebook",
  5: "Twitter",
  6: "Twitch",
  8: "Instagram",
  9: "Youtube",
  10: "iPhone",
  11: "iPad",
  12: "Android",
  13: "Steam",
  14: "Reddit",
  15: "Itch",
  16: "Epic Games",
  17: "GOG",
  18: "Discord",
};

interface Websites {
  url: string;
  category: number;
}

export const convertWebsites = (websites: Websites[]) => {
  const res: {
    social: any[];
    stores: any[];
    other: any[];
  } = {
    social: [],
    stores: [],
    other: [],
  };

  for (const website of websites) {
    const item = {
      // @ts-ignore
      name: websiteCatToName[website.category],
      url: website.url,
    };

    if (website.category <= 3) {
      res.other.push(item);
    } else if (
      website.category <= 9 ||
      website.category == 14 ||
      website.category == 18
    ) {
      res.social.push(item);
    } else {
      res.stores.push(item);
    }
  }

  return res;
};

const recognizedPlatforms = [
  "PS3",
  "PS4",
  "PS5",
  "Vita",
  "XONE",
  "Series X",
  "X360",
  "Wii",
  "WiiU",
  "PC",
  "Switch",
  "Linux",
  "Mac",
  "iOS",
  "Android",
  "N64",
  "3DS",
  "browser",
];

export const simplePlatforms = (platforms: { abbreviation: string }[]) => {
  const res: any[] = [];
  if (!platforms) return res;

  for (const platform of platforms) {
    const p = platform.abbreviation;
    if (["PS3", "PS4", "PS5", "Vita"].includes(p)) {
      if (!res.includes("PlayStation")) {
        res.push("PlayStation");
      }
    } else if (["XONE", "Series X", "X360"].includes(p)) {
      if (!res.includes("Xbox")) {
        res.push("Xbox");
      }
    } else if (["Wii", "WiiU"].includes(p)) {
      if (!res.includes("Wii")) {
        res.push("Wii");
      }
    } else if (recognizedPlatforms.includes(p)) {
      res.push(p);
    }
  }

  return res;
};

// TODO: constants for IGDB videos to firestore clips (users and dates)