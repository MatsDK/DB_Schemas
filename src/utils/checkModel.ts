import { SchemaRef } from "../SchemaRef";

export const checkModelRecursive = (
  schema: any,
  doc: any,
  modelName: string
) => {
  const schemaKeys: string[] = Object.keys(schema),
    docKeys: string[] = Object.keys(doc);

  docKeys.forEach((docKey: string) => {
    if (!(docKey in schema))
      return console.log(`property ${docKey} does not exist on ${modelName}`);
    else if (
      schema[docKey].constructor.name ===
      new new SchemaRef(schema).newSchemaRef("", { isArray: false }).constructor
        .name
    )
      doc[docKey] = checkModelRecursive(
        schema[docKey].schema,
        doc[docKey] || {},
        schema[docKey].modelName
      );
  });

  schemaKeys.forEach((schemaKey) => {
    if (
      schema[schemaKey].constructor.name ===
      new new SchemaRef(schema).newSchemaRef("", { isArray: false }).constructor
        .name
    ) {
      // console.log(schema[schemaKey].isArray);
      const newSchemaObj: any = new Object(doc[schemaKey]);

      Object.keys(schema[schemaKey].schema).forEach((key: string) => {
        if (typeof newSchemaObj[key] === "undefined")
          newSchemaObj[key] = undefined;
      });

      doc[schemaKey] = newSchemaObj;
    } else if (typeof doc[schemaKey] === "undefined")
      doc[schemaKey] = undefined;
  });

  return doc;
};
