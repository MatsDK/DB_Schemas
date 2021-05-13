import { dataBaseData, optionsType } from "./../../types";
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
