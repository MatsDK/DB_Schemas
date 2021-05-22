import { collectionObj, dataBaseData, optionsType } from "./../../types";
import { connect } from "../connect";
import { constructDocument } from "../constructDocument";
import { Document } from "../../Document";

export const getDataBase = async (
  options: optionsType
): Promise<{ err: string } | dataBaseData> => {
  const data = await connect(
    { port: options.port, host: options.host },
    { eventName: "getDataBaseData", data: { db: options.database } }
  );
  if (data.err) return { err: data.err };

  return data;
};

export const findData = async (
  query: any,
  obj: collectionObj,
  options: optionsType
): Promise<{ err: string } | Array<any>> => {
  const data = await connect(
    { port: options.port, host: options.host },
    {
      eventName: "findData",
      data: {
        collection: obj._name,
        db: options.database,
        query,
      },
    }
  );
  if (data.err) return data;

  const constructedDocs = [];
  for (let doc of data.docs) {
    const thisDocId = doc._id;
    delete doc._id;
    const constructedDoc = new Document(doc, obj, options, { complete: false });

    Object.defineProperty(constructedDoc, "_id", {
      value: thisDocId,
      writable: false,
      enumerable: true,
    });
    constructedDocs.push(constructedDoc);
  }
  data.docs = constructedDocs;

  return data;
};
