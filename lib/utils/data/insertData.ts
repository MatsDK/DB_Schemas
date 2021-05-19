import { collectionObj, optionsType, PropertyType } from "../../types";
import { connect } from "../connect";

export const insertHandlers = async (
  insertDocs: any[],
  obj: collectionObj,
  options: optionsType,
  cb?: Function
) => {
  const insert = await insertData(insertDocs, obj, options);
  if (insert.err) {
    if (cb) cb(insert.err, null);
    return insert.err;
  }

  if (cb) cb(null, insert.insertedDocs);
  return insert.insertedDocs;
};

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

export const getUniquePropsRecursive = (
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
