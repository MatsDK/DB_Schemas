import { isNestedObj, isOptionsObj, isSchemaRef } from "../helpers";

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

      if (schema[key].type != typeof updateQuery[key])
        return {
          err: `type ${
            schema[key].type
          } doesn't equal type ${typeof updateQuery[key]}`,
        };
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
