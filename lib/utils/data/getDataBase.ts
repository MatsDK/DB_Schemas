import { CollectionsManagerObj, dataBaseData, optionsType } from "../types";
import BSON from "bson";
import fs from "fs";
import path from "path";

export const getDataBase = (
  options: optionsType
): { err: string } | dataBaseData => {
  const dbs: any = BSON.deserialize(
    fs.readFileSync(path.resolve(__dirname, "../../../data/data"))
  );

  const thisDb: { _id: string; Collections: CollectionsManagerObj } =
    dbs.dbs[options.database.toLowerCase()];
  if (!thisDb) return { err: `Database ${options.database} not found` };

  return thisDb;
};
