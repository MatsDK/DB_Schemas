import { checkModelRecursiveRet } from "src/SchemaInterfaces";
import { constructObj } from "./constructModel";
import { isNestedObj, isOptionsObj, isSchemaRef } from "../helpers";

// check if properties on the new object are the same as the properties declared in the schema
export const checkModelRecursive = (
  schema: any,
  doc: any,
  modelName: string
): checkModelRecursiveRet => {
  try {
    const docKeys: string[] = Object.keys(doc);

    for (let idx = 0; idx < docKeys.length; idx++) {
      const key: string = docKeys[idx];

      if (!(key in schema)) {
        throw new Error(`property ${key} does not exist on ${modelName}`);
      } else if (isSchemaRef(schema, schema[key])) {
        if (
          typeof doc[key] !== "undefined" &&
          schema[key].isArray !== Array.isArray(doc[key])
        )
          throw new Error("incorrect array type");

        if (schema[key].isArray) {
          const newArr: any[] = [];
          doc[key].forEach((x: any, i: number) => {
            const newObj = checkModelRecursive(
              schema[key].schema,
              x || {},
              schema[key].modelName
            );
            if (newObj.err) throw new Error(newObj.errData);

            newArr[i] = newObj.doc;
          });
          doc[key] = newArr;
        } else {
          if (typeof doc[key] !== "object")
            throw new Error("incorrect data type declared");

          const newObj = checkModelRecursive(
            schema[key].schema,
            doc[key] || {},
            schema[key].modelName
          );

          if (newObj.err) throw new Error(newObj.errData);

          doc[key] = newObj.doc;
        }
      } else if (Array.isArray(schema[key])) {
        if (!Array.isArray(doc[key]))
          throw new Error(
            `cannot convery propery ${key} of type array to object`
          );

        doc[key].forEach((x: any) => {
          const checkRecursive = checkModelRecursive(
            schema[key][0],
            x,
            modelName
          );
          if (checkRecursive.err) throw new Error(checkRecursive.errData);

          x = checkRecursive.doc;
        });
      } else if (isNestedObj(schema, doc, key)) {
        if (Array.isArray(doc[key]))
          throw new Error(
            `cannot convery propery ${key} of type object to array`
          );

        const checkCurrObj = checkModelRecursive(
          schema[key],
          doc[key],
          modelName
        );

        if (checkCurrObj.err) throw new Error(checkCurrObj.errData);
        doc[key] = checkCurrObj.doc;
      }
    }

    doc = constructObj(schema, doc);
    return { err: false, doc };
  } catch (err) {
    throw err;
  }
};

// check if schema propery options are correctly declared with the given options
export const checkModelOptions = (
  doc: any,
  schema: any
): { err?: boolean | string } => {
  const docKeys: string[] = Object.keys(doc);

  for (let i = 0; i < docKeys.length; i++) {
    const key = docKeys[i];
    if (isOptionsObj(schema[key])) {
      if (schema[key].required && (doc[key] == null || doc[key] === ""))
        return { err: `property ${key} is required` };

      if (schema[key].type != typeof doc[key])
        return {
          err: `type ${schema[key].type} doesn't equal type ${typeof doc[key]}`,
        };
    } else if (isSchemaRef(schema, schema[key] || {})) {
      if (schema[key].isArray) {
        const checkArray = checkArrayOptions(doc[key], schema[key]);
        if (checkArray.err) return { err: checkArray.err };
      } else {
        const checkModel = checkModelOptions(doc[key], schema[key].schema);
        if (checkModel.err) return { err: checkModel.err };
      }
    } else if (Array.isArray(schema[key])) {
      for (let j = 0; j < doc[key].length; j++) {
        const checkOptionsRecursive: {
          err?: boolean | string;
        } = checkModelOptions(doc[key][j], schema[key][0]);

        if (checkOptionsRecursive.err)
          return { err: checkOptionsRecursive.err };
      }
    } else if (isNestedObj(schema, doc, key)) {
      const checkModel = checkModelOptions(doc[key], schema[key]);
      if (checkModel.err) return { err: checkModel.err };
    }
  }
  return { err: false };
};

const checkArrayOptions = (
  docs: any[],
  schema: any
): { err?: boolean | string } => {
  for (let i = 0; i < docs.length; i++) {
    const doc: any = docs[i];
    const checkModel = checkModelOptions(doc, schema.schema);
    if (checkModel.err) return { err: checkModel.err };
  }
  return { err: false };
};

// check if update query is valid
export const checkUpdateProps = (
  schema: any,
  updateQuery: any,
  modelName: string
): { err: string } => {
  const updateKeys = Object.keys(updateQuery);

  for (let idx = 0; idx < updateKeys.length; idx++) {
    const key: string = updateKeys[idx];

    if (Array.isArray(schema[key])) return { err: "can't update array" };

    if (!(updateKeys[idx] in schema))
      return {
        err: `property ${key} does not exists on ${modelName} schema`,
      };

    if (isOptionsObj(schema[key])) {
      if (typeof updateQuery[key] === "object")
        return { err: "can't change type" };

      if (
        schema[key].required &&
        (typeof updateQuery[key] == "undefined" || updateQuery[key] == null)
      )
        return { err: `property ${key} is required` };
    } else if (isSchemaRef(schema, schema[key])) {
      if (schema[key].isArray) return { err: "can't update array type" };
      else {
        const checkRecursive: { err: string } = checkUpdateProps(
          schema[key],
          updateQuery[key],
          modelName
        );
        if (checkRecursive.err) return { err: checkRecursive.err };
      }
    } else if (isNestedObj(schema, updateQuery, key)) {
      const checkRecursive: { err: string } = checkUpdateProps(
        schema[key],
        updateQuery[key],
        modelName
      );

      if (checkRecursive.err) return { err: checkRecursive.err };
    } else {
      let isCorrectType = false;

      Object.keys(schema[key]).forEach((schemaKey: string) => {
        if (typeof updateQuery[schemaKey] !== "undefined") isCorrectType = true;
      });

      if (!isCorrectType) return { err: "incorrect type" };
    }
  }

  return { err: "" };
};
