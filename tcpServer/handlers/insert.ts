import BSON from "bson";
import fs from "fs";
import path from "path";
import {
  collectionObj,
  dataBaseData,
  getPropValuesReturn,
  insertProps,
} from "../../types";
import { checkIfUniqueValue } from "./utils/uniqueValues";
import { v4 as uuid } from "uuid";

export const insertHandler = ({
  collection,
  db,
  uniqueProps,
  docs,
}: insertProps) => {
  const dbs: any = BSON.deserialize(
    fs.readFileSync(path.resolve(__dirname, "../../data/data"))
  );
  const thisDb: undefined | dataBaseData = dbs.dbs[db.toLowerCase()];
  if (!thisDb) return { err: `Database '${db}' not found` };

  const thisCollection: undefined | collectionObj = Object.keys(
    thisDb.Collections
  )
    .map((_: string) => thisDb.Collections[_])
    .find((_) => _._id === collection.trim().toLowerCase());
  if (!thisCollection) return { err: `Collection not found` };

  const collectionData = BSON.deserialize(
    fs.readFileSync(path.resolve(__dirname, `../../data/${thisCollection._id}`))
  );

  const checkIfDuplicateValues: getPropValuesReturn = checkIfUniqueValue(
    uniqueProps,
    docs,
    collectionData.docs
  );
  if (checkIfDuplicateValues.err) return { err: checkIfDuplicateValues.err };
  for (const doc of docs) doc._id = uuid();

  collectionData.docs = [...docs, ...collectionData.docs];
  fs.writeFileSync(
    path.resolve(__dirname, `../../data/${thisCollection._id}`),
    BSON.serialize(collectionData)
  );

  return { err: false, insertedDocs: docs };
};
