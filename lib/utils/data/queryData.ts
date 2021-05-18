import { collectionObj, dataBaseData, optionsType } from "./../../types";
import { connect } from "../connect";

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
  quertyOptions: any,
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
        quertyOptions,
      },
    }
  );

  return data;
};
