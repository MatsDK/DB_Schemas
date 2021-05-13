import {
  collectionObj,
  CollectionsManagerObj,
  dataBaseData,
  optionsType,
} from "../types";
import fs from "fs";
import BSON from "bson";
import path from "path";

export const createCollection = async (
  newCollectionObj: collectionObj,
  options: optionsType
): Promise<{ err: boolean | string; collections?: CollectionsManagerObj }> => {
  const dbs: any = BSON.deserialize(
    fs.readFileSync(path.resolve(__dirname, "../../../data/data"))
  );
  const thisDb: undefined | dataBaseData =
    dbs.dbs[options.database.toLowerCase()];
  if (!thisDb) return { err: `Database '${options.database}' not found` };

  if (thisDb.Collections[newCollectionObj._name.toLowerCase()])
    return {
      err: `Collection with name '${newCollectionObj._name}' already exists`,
    };

  thisDb.Collections[newCollectionObj._name.toLowerCase()] = newCollectionObj;
  fs.writeFileSync(
    path.resolve(__dirname, "../../../data/data"),
    BSON.serialize(dbs)
  );

  return { err: false, collections: thisDb.Collections };
};
