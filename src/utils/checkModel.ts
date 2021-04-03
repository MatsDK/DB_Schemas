import { isNestedObj, isOptionsObj, isSchemaRef } from "./helpers";

interface checkModelRecursiveRet {
  err: boolean;
  doc?: any;
  errData?: string;
}

export const checkModelRecursive = (
  schema: any,
  doc: any,
  modelName: string
): checkModelRecursiveRet => {
  const docKeys: string[] = Object.keys(doc);

  for (let i = 0; i < docKeys.length; i++) {
    if (!(docKeys[i] in schema)) {
      return {
        err: true,
        errData: `property ${docKeys[i]} does not exist on ${modelName}`,
      };
    } else if (isSchemaRef(schema, schema[docKeys[i]])) {
      doc[docKeys[i]] = checkModelRecursive(
        schema[docKeys[i]].schema,
        doc[docKeys[i]] || {},
        schema[docKeys[i]].modelName
      ).doc;
    } else if (isNestedObj(schema, doc, docKeys[i])) {
      const checkCurrObj = checkModelRecursive(
        schema[docKeys[i]],
        doc[docKeys[i]],
        modelName
      );

      if (checkCurrObj.err)
        return {
          err: true,
          errData: checkCurrObj.errData,
        };
    }
  }

  doc = constructObj(schema, doc);

  return { err: false, doc };
};

export const constructObj = (schema: any, doc: any) => {
  const schemaKeys: string[] = Object.keys(schema);

  schemaKeys.forEach((schemaKey) => {
    if (isOptionsObj(schema[schemaKey])) {
      console.log(schemaKey, "isOptions");
    } else if (isSchemaRef(schema, schema[schemaKey])) {
      const newSchemaObj: any = new Object(doc[schemaKey]);
      Object.keys(schema[schemaKey].schema).forEach((key: string) => {
        if (typeof newSchemaObj[key] === "undefined") newSchemaObj[key] = null;
      });

      doc[schemaKey] = newSchemaObj;
    } else if (
      typeof doc[schemaKey] === "undefined" &&
      typeof schema[schemaKey] !== "object"
    )
      doc[schemaKey] = null;
    else if (
      typeof schema[schemaKey] === "object" &&
      schema[schemaKey] !== null
    )
      doc[schemaKey] = constructObj(schema[schemaKey], doc[schemaKey] || {});
  });

  return doc;
};

export const checkModelOptions = (doc: any, schema: any) => {
  const docKeys: string[] = Object.keys(doc);

  docKeys.forEach((key: string) => {
    // console.log(schema[key]);
  });
};
