import { isOptionsObj, isSchemaRef } from "../helpers";

// Create new model and set all properiest that aren't defined to null

export const constructObj = (schema: any, doc: any) => {
  try {
    const schemaKeys: string[] = Object.keys(schema);

    schemaKeys.forEach((schemaKey) => {
      if (
        isOptionsObj(schema[schemaKey]) &&
        !isSchemaRef(schema, schema[schemaKey])
      ) {
        if (typeof doc[schemaKey] === "object") {
          doc[schemaKey] = schema[schemaKey].defaultValue ?? null;
        }
        doc[schemaKey] =
          typeof doc[schemaKey] !== "undefined"
            ? doc[schemaKey]
            : schema[schemaKey].defaultValue;
        if (doc[schemaKey] === undefined)
          doc[schemaKey] = schema[schemaKey].defaultValue || null;
      } else if (isSchemaRef(schema, schema[schemaKey])) {
        if (
          typeof doc[schemaKey] !== "undefined" &&
          schema[schemaKey].isArray !== Array.isArray(doc[schemaKey])
        )
          throw new Error("incorrect array type");

        if (schema[schemaKey].isArray) {
          if (typeof doc[schemaKey] !== "undefined")
            doc[schemaKey].forEach((x: any) => {
              x = constructObj(schema[schemaKey].schema, x || {});
            });
          else doc[schemaKey] = [];
        } else if (typeof doc[schemaKey] === "undefined") {
          const newObj = new Object();
          Object.keys(schema[schemaKey].schema).forEach((key) => {
            newObj[key] = null;
          });

          doc[schemaKey] = newObj;
        }
      } else if (Array.isArray(schema[schemaKey])) {
        if (typeof doc[schemaKey] != "undefined") {
          if (Array.isArray(doc[schemaKey])) {
            doc[schemaKey].forEach((x) => {
              x = constructObj(schema[schemaKey][0], x);
            });
          }
        }
      } else if (
        typeof doc[schemaKey] === "undefined" &&
        typeof schema[schemaKey] !== "object"
      ) {
        doc[schemaKey] = null;
      } else if (
        typeof schema[schemaKey] === "object" &&
        schema[schemaKey] !== null
      ) {
        doc[schemaKey] = constructObj(schema[schemaKey], doc[schemaKey] || {});
      }
    });

    return doc;
  } catch (err) {
    throw err;
  }
};
