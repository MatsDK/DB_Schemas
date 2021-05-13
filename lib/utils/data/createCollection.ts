import {
  collectionObj,
  CollectionsManagerObj,
  optionsType,
} from "./../../types";
import { connect } from "../connect";

export const createCollection = async (
  newCollectionObj: collectionObj,
  options: optionsType
): Promise<{
  err: boolean | string;
  data?: CollectionsManagerObj;
}> => {
  const data = await connect(
    { port: options.port, host: options.host },
    {
      eventName: "createCollection",
      data: { db: options.database, newCollectionObj },
    }
  );
  if (data.err) return { err: data.err };

  return data;
};
