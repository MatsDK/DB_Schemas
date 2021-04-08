import { isOptionsObj, isSchemaRef } from "./helpers";

const types: string[] = ["string", "number", "boolean"];

export const checkSchemaOptions = (schema: any) => {
  const schemaKeys: string[] = Object.keys(schema);
  for (let idx = 0; idx < schemaKeys.length; idx++) {
    const schemaKey: string = schemaKeys[idx];

    if (isOptionsObj(schema[schemaKey])) {
      if (typeof schema[schemaKey].type === "undefined")
        return { err: `type is required on propery ${schemaKeys[idx]}` };

      if (!types.includes(schema[schemaKey].type))
        return { err: `${schema[schemaKey].type} is invalid type` };

      const thisDefaultValue: any = schema[schemaKey].defaultValue;
      if (
        typeof thisDefaultValue != "undefined" &&
        typeof thisDefaultValue != schema[schemaKey].type
      )
        return {
          err: `type ${schema[schemaKey].type} doesn't equal defaultValue's type`,
        };
    } else if (isSchemaRef(schema, schema[schemaKey])) {
      const checkRecursive: { err: string | boolean } = checkSchemaOptions(
        schema[schemaKey].schema
      );
      if (checkRecursive.err) return { err: checkRecursive.err };
    } else if (Array.isArray(schema[schemaKey])) {
      if (schema[schemaKey].length > 1)
        return { err: "array in schema should have a length of 1" };

      const checkRecursive: { err: string | boolean } = checkSchemaOptions(
        schema[schemaKey][0]
      );
      if (checkRecursive.err) return { err: checkRecursive.err };
    } else {
      const checkRecursive: { err: string | boolean } = checkSchemaOptions(
        schema[schemaKey]
      );
      if (checkRecursive.err) return { err: checkRecursive.err };
    }
  }
  return { err: false };
};
