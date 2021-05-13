import { CollectionsManagerObj, dataBaseData, optionsType } from "../types";
import BSON from "bson";
import fs from "fs";
import path from "path";
import { connect } from "../connect";

export const getDataBase = async (
  options: optionsType
): Promise<{ err: string } | dataBaseData> => {
  const data = await connect(
    { port: options.port, host: options.host },
    { eventName: "getdatabasedata", data: { db: options.database } }
  );
  console.log(data);

  const dbs: any = BSON.deserialize(
    fs.readFileSync(path.resolve(__dirname, "../../../data/data"))
  );

  const thisDb: { _id: string; Collections: CollectionsManagerObj } =
    dbs.dbs[options.database.toLowerCase()];
  if (!thisDb) return { err: `Database ${options.database} not found` };

  return thisDb;
};
