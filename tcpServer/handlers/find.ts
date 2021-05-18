import fs from "fs";
import path from "path";
import BSON from "bson";
import { collectionObj, dataBaseData, findDataProps } from "../../types";

export const findData = async ({ db, collection }: findDataProps) => {
  try {
    const dbs: any = BSON.deserialize(
      fs.readFileSync(path.resolve(__dirname, "../../data/data"))
    );
    const thisDb: undefined | dataBaseData = dbs.dbs[db.toLowerCase()];
    if (!thisDb) return { err: `Database '${db}' not found` };

    const thisCollection: undefined | collectionObj =
      thisDb.Collections[collection.trim().toLowerCase()];
    if (!thisCollection) return { err: `Collection '${collection}' not found` };

    const thisCollectionData = BSON.deserialize(
      fs.readFileSync(
        path.resolve(__dirname, `../../data/${thisCollection._id}`)
      )
    );

    return { err: false, docs: thisCollectionData.docs };
  } catch (err) {
    console.log(err);
    return { err: err.message };
  }
};
