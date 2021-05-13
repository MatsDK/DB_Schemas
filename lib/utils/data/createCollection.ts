import {
  collectionObj,
  CollectionsManagerObj,
  optionsType,
} from "./../../types";
import { connect } from "../connect";
import { defaultCollectionObj } from "../constants";
import { v4 as uuid } from "uuid";

export const createCollection = async (
  options: optionsType,
  createCollectionObj: any
): Promise<{
  err: boolean | string;
  data?: CollectionsManagerObj;
}> => {
  if (!createCollectionObj.name.trim()) {
    return { err: "Give a valid name for a collection" };
  }

  const newCollectionObj: collectionObj = {
    ...defaultCollectionObj,
    _name: createCollectionObj.name.trim(),
    _strict: !!createCollectionObj.schema,
    _id: uuid(),
  };

  if (newCollectionObj._strict)
    newCollectionObj.schema = createCollectionObj.schema?._schema;

  const data: any = await connect(
    { port: options.port, host: options.host },
    {
      eventName: "createCollection",
      data: { db: options.database, newCollectionObj },
    }
  );

  if (data.err) return { err: data.err };
  if (data.err) {
    return { err: data.err };
  }

  return data;
};
