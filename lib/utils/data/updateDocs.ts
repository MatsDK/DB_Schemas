import { collectionObj, optionsType } from "../../types";
import { connect } from "../connect";

export const updateDocs = async (
  docs: any[],
  obj: collectionObj,
  options: optionsType,
  uniqueProps: string[]
) => {
  const data = await connect(
    { port: options.port, host: options.host },
    {
      eventName: "updateDocs",
      data: { db: options.database, collection: obj._name, docs, uniqueProps },
    }
  );
  if (data.err) return { err: data.err };

  return data;
};
