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
  const uniqueProps: string[] = getUniquePropsRecursive(obj.schema.properties);

  const data = await connect(
    { port: options.port, host: options.host },
    {
      eventName: "insertDocs",
      data: { db: options.database, collection: obj._id, docs, uniqueProps },
    }
  );
  if (data.err) return { err: data.err };

  return { insertedDocs: data.insertedDocs };
};

const getUniquePropsRecursive = (
  schemaProperties: PropertyType[],
  currObjPath: string = ""
): string[] => {
  let uniqueProps: string[] = [];

  for (const property of schemaProperties) {
    if (property.isObject && !property.isArray)
      uniqueProps = [
        ...getUniquePropsRecursive(
          property.properties,
          `${currObjPath}${property.name}.`
        ),
        ...uniqueProps,
      ];
    else if (property.unique)
      uniqueProps.push(`${currObjPath}${property.name}`);
  }

  return uniqueProps;
};
