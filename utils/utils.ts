import {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  animals,
} from "unique-names-generator";

export const generateUsername = () => {
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const generated_name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "",
    style: "capital",
  });

  return generated_name;
};

export enum UserRole {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  OWNER = 3,
}
