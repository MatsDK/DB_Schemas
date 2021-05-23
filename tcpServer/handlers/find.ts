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

    const idxs: number[] = Array.from(
      filterData(thisCollectionData.docs, query.where).idxs
    );
    idxs.splice(0, query.skip);
    if (query.limit != null) idxs.length = query.limit;
    let validDocs = idxs
      .filter((_: number | undefined) => _ != null)
      .map((_: number) => thisCollectionData.docs[_]);

    validDocs = orderData(query.orderBy, validDocs);
    return { err: false, docs: validDocs };
  } catch (err) {
    console.log(err);
    return { err: err.message };
  }
};

type orderReturn = "asc" | "desc";
const orderData = (orderQuery: any, docs: any[]): any[] => {
  const getOrder = (orderQuery: any): orderReturn => {
    const thisValue = orderQuery[Object.keys(orderQuery)[0]];
    if (typeof thisValue === "object" && thisValue != null)
      return getOrder(thisValue);

    return thisValue;
  };

  const getValue = (obj: any, query: any): string => {
    const thisValue = obj[Object.keys(query)[0]];
    if (typeof thisValue === "object" && thisValue != null)
      return getValue(thisValue, query[Object.keys(query)[0]]);

    return thisValue;
  };

  const order: orderReturn = getOrder(orderQuery);
  return docs.sort((a: any, b: any) => {
    [a, b] = [getValue(a, orderQuery), getValue(b, orderQuery)];
    return order == "asc" ? a - b : b - a;
  });
};
