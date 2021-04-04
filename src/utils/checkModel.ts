import { checkModelRecursiveRet } from "src/SchemaInterfaces";
import { isNestedObj, isOptionsObj, isSchemaRef } from "./helpers";

// check if properties on the new object are the same as the properties declared in the schema
export const checkModelRecursive = (
  schema: any,
  doc: any,
  modelName: string
): checkModelRecursiveRet => {
  const docKeys: string[] = Object.keys(doc);

  for (let idx = 0; idx < docKeys.length; idx++) {
    if (!(docKeys[idx] in schema)) {
      throw new Error(
        `property ${docKeys[idx]} does not exist on ${modelName}`
      );
    } else if (isSchemaRef(schema, schema[docKeys[idx]])) {
      if (
        typeof doc[docKeys[idx]] !== "undefined" &&
        schema[docKeys[idx]].isArray !== Array.isArray(doc[docKeys[idx]])
      )
        throw new Error("incorrect array type");

      if (schema[docKeys[idx]].isArray) {
        const newArr: any[] = [];
        doc[docKeys[idx]].forEach((x: any, i: number) => {
          const newObj = checkModelRecursive(
            schema[docKeys[idx]].schema,
            x || {},
            schema[docKeys[idx]].modelName
          );
          if (newObj.err) throw new Error(newObj.errData);

          newArr[i] = newObj.doc;
        });
        doc[docKeys[idx]] = newArr;
      } else {
        if (typeof doc[docKeys[idx]] !== "object") {
          throw new Error("incorrect data type declared");
        }

        const newObj = checkModelRecursive(
          schema[docKeys[idx]].schema,
          doc[docKeys[idx]] || {},
          schema[docKeys[idx]].modelName
        );

        if (newObj.err) throw new Error(newObj.errData);

        doc[docKeys[idx]] = newObj.doc;
      }
    } else if (isNestedObj(schema, doc, docKeys[idx])) {
      const checkCurrObj = checkModelRecursive(
        schema[docKeys[idx]],
        doc[docKeys[idx]],
        modelName
      );

      if (checkCurrObj.err) throw new Error(checkCurrObj.errData);
    }
  }

  doc = constructObj(schema, doc);
  return { err: false, doc };
};

// Create new model and set all properiest that aren't defined to null
export const constructObj = (schema: any, doc: any) => {
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
      } else {
        if (typeof doc[schemaKey] === "undefined") {
          const newObj = new Object();
          Object.keys(schema[schemaKey].schema).forEach((key) => {
            newObj[key] = null;
          });

          doc[schemaKey] = newObj;
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
};

// check if schema propery options are correctly declared with the given options
export const checkModelOptions = (doc: any, schema: any) => {
  const docKeys: string[] = Object.keys(doc);

  console.log(doc);

  docKeys.forEach((key: string) => {
    // console.log(schema[key]);
  });
};
