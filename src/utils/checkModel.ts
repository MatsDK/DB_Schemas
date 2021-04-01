import { SchemaRef } from "../SchemaRef";

interface checkModelRecursiveRet {
  err: boolean | string;
  doc?: any;
}

export const checkModelRecursive = (
  schema: any,
  doc: any,
  modelName: string
): checkModelRecursiveRet => {
  const docKeys: string[] = Object.keys(doc);

  for (let i = 0; i < docKeys.length; i++) {
    if (!(docKeys[i] in schema)) {
      throw `property ${docKeys[i]} does not exist on ${modelName}`;
    } else if (isSchemaRef(schema, schema[docKeys[i]])) {
      doc[docKeys[i]] = checkModelRecursive(
        schema[docKeys[i]].schema,
        doc[docKeys[i]] || {},
        schema[docKeys[i]].modelName
      ).doc;
    }
  }

  doc = constructObj(schema, doc);

  return { err: false, doc };
};

export const constructObj = (schema: any, doc: any) => {
  const schemaKeys: string[] = Object.keys(schema);

  schemaKeys.forEach((schemaKey) => {
    if (isSchemaRef(schema, schema[schemaKey])) {
      // console.log(schema[schemaKey].isArray);
      const newSchemaObj: any = new Object(doc[schemaKey]);
      Object.keys(schema[schemaKey].schema).forEach((key: string) => {
        if (typeof newSchemaObj[key] === "undefined") newSchemaObj[key] = null;
      });

      doc[schemaKey] = newSchemaObj;
    } else if (typeof doc[schemaKey] === "undefined") doc[schemaKey] = null;
  });

  return doc;
};

const isSchemaRef = (schema: any, thisSchema: any) => {
  return (
    thisSchema.constructor.name ===
    new new SchemaRef(schema).newSchemaRef("", { isArray: false }).constructor
      .name
  );
};
