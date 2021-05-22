import fs from "fs";
import path from "path";
import BSON from "bson";
import { collectionObj, dataBaseData, findDataProps } from "../../types";
import { filterData } from "./helpers/filterData";

export const findData = async ({ db, collection, query }: findDataProps) => {
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

    const { ids }: { ids: Set<number> } = filterData(
        thisCollectionData.docs,
        query.where
      ),
      validDocs = Array.from(ids).map(
        (_: number) => thisCollectionData.docs[_]
      );

    return { err: false, docs: validDocs };
  } catch (err) {
    console.log(err);
    return { err: err.message };
  }
};
