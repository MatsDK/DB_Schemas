import {
  collectionObj,
  optionsType,
  PropertyType,
  SchemaType,
} from "../../types";
import { connect } from "../connect";

export const insertData = async (
  docs: any[],
  obj: collectionObj,
  options: optionsType
) => {
  // const uniqueProps: string[] = obj.schema.properties
  //   .filter((_: PropertyType) => _.unique)
  //   .map((_: PropertyType) => _.name);

  const data = await connect(
    { port: options.port, host: options.host },
    {
      eventName: "insertDocs",
      data: { db: options.database, collection: obj._id, docs },
    }
  );
  if (data.err) return { err: data.err };

  return { insertedDocs: data.insertedDocs };
};
