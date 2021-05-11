import { PropertyType, SchemaType } from "../Collection";
import { defaultPropertyObj, optionsObjProps, types } from "./constants";
import { Schema } from "../Schema";

export const constructSchema = (obj: any): SchemaType => {
  let objKeys: string[] = Object.keys(obj),
    schemaObj: SchemaType = { properties: [] };

  const checkProperty = (
    obj: any,
    key: string,
    schemaObj: SchemaType
  ): SchemaType => {
    // Check if type directly declared in schema
    if (typeof obj === "function" && types.includes(obj.name)) {
      const thisPropertyType: string | undefined = types.find(
        (_: string) => _ === obj.name
      );

      schemaObj.properties.push({
        ...defaultPropertyObj,
        name: key,
        instanceOf: thisPropertyType || "Any",
      });

      return schemaObj;
    }

    // Check if Object is Array
    if (Array.isArray(obj)) {
      if (obj.length < 1) return schemaObj;

      const tmpSchemaObj: SchemaType = constructSchema({}),
        {
          properties: [Obj],
        }: SchemaType = checkProperty(obj[0], key, tmpSchemaObj);

      Obj.isArray = true;

      schemaObj.properties.push(Obj);
      return schemaObj;
    }

    // Check if options Object is declared
    if (isOptionsObj(obj)) {
      const thisPropertyType: string | undefined = types.find(
        (_: string) => _ === obj.type?.name
      );

      let thisObj: PropertyType = {
        ...defaultPropertyObj,
        name: key,
        instanceOf: thisPropertyType ?? defaultPropertyObj.instanceOf,
        maxLength: obj.max ?? defaultPropertyObj.maxLength,
        unique: obj.unique ?? defaultPropertyObj.unique,
        required: obj.required ?? defaultPropertyObj.required,
        default: obj.default ?? defaultPropertyObj.default,
      };

      schemaObj.properties.push(thisObj);
      return schemaObj;
    }

    // Check if Object is a reference to another schema
    if (obj instanceof Schema) {
      schemaObj.properties.push({
        ...defaultPropertyObj,
        name: key,
        properties: obj._schema.properties,
        isObject: true,
      });
      return schemaObj;
    }

    if (typeof obj === "object" && obj != null) {
      const { properties } = constructSchema(obj);
      schemaObj.properties.push({
        ...defaultPropertyObj,
        name: key,
        properties,
        isObject: true,
      });

      return schemaObj;
    }
    return schemaObj;
  };

  for (let key of objKeys) {
    if (!obj[key]) continue;

    schemaObj = checkProperty(obj[key], key, schemaObj);
  }

  return schemaObj;
};

const isOptionsObj = (obj: any): boolean => {
  return Object.keys(obj).every((_: string) =>
    optionsObjProps.includes(_.toLowerCase())
  );
};
