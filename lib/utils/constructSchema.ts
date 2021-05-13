import {
  defaultPropertyObj,
  forbiddenProps,
  optionsObjProps,
  types,
} from "./constants";
import { Schema } from "../Schema";
import { PropertyType, SchemaType } from "./../types";

export const constructSchema = (obj: any): SchemaType => {
  let objKeys: string[] = Object.keys(obj),
    schemaObj: SchemaType = { properties: [] };

  for (let key of objKeys) {
    if (forbiddenProps.includes(key.trim().toLowerCase()))
      throw `Don't put the property ${key} on a Schema`;

    if (!obj[key]) continue;

    schemaObj = checkProperty(obj[key], key, schemaObj);
  }

  return schemaObj;
};

const checkProperty = (
  obj: any,
  key: string,
  schemaObj: SchemaType
): SchemaType => {
  // Check if type directly declared in schema
  if (typeof obj === "function" && types.includes(obj.name))
    return getPropertyType(obj, key, schemaObj);

  // Check if Object is Array
  if (Array.isArray(obj)) return setArrayRecursive(obj, key, schemaObj);

  // Check if options Object is declared
  if (isOptionsObj(obj)) return setOptionsObject(obj, key, schemaObj);

  // Check if Object is a reference to another schema
  if (obj instanceof Schema) return setSchemaRef(obj, key, schemaObj);

  // Check if property is Nested Object
  if (typeof obj === "object" && obj != null)
    return setObjRecursive(obj, key, schemaObj);

  return schemaObj;
};

const getPropertyType = (
  obj: any,
  key: string,
  schemaObj: SchemaType
): SchemaType => {
  const thisPropertyType: string | undefined = types.find(
    (_: string) => _ === obj.name
  );

  schemaObj.properties.push({
    ...defaultPropertyObj,
    name: key,
    instanceOf: thisPropertyType || "Any",
  });

  return schemaObj;
};

const setArrayRecursive = (
  obj: any,
  key: string,
  schemaObj: SchemaType
): SchemaType => {
  if (obj.length < 1) return schemaObj;

  const tmpSchemaObj: SchemaType = constructSchema({}),
    {
      properties: [Obj],
    }: SchemaType = checkProperty(obj[0], key, tmpSchemaObj);

  Obj.isArray = true;

  schemaObj.properties.push(Obj);
  return schemaObj;
};

const setOptionsObject = (
  obj: any,
  key: string,
  schemaObj: SchemaType
): SchemaType => {
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

  if (
    thisObj.instanceOf !== "Any" &&
    thisObj.default != null &&
    typeof thisObj.default !== thisObj.instanceOf.toLowerCase()
  )
    throw Error(
      `Defined type of ${key} doesn't match the default value's type`
    );

  schemaObj.properties.push(thisObj);
  return schemaObj;
};

const setSchemaRef = (
  obj: any,
  key: string,
  schemaObj: SchemaType
): SchemaType => {
  schemaObj.properties.push({
    ...defaultPropertyObj,
    name: key,
    properties: obj._schema.properties,
    isObject: true,
  });

  return schemaObj;
};

const setObjRecursive = (
  obj: any,
  key: string,
  schemaObj: SchemaType
): SchemaType => {
  const { properties } = constructSchema(obj);
  schemaObj.properties.push({
    ...defaultPropertyObj,
    name: key,
    properties,
    isObject: true,
  });

  return schemaObj;
};

const isOptionsObj = (obj: any): boolean => {
  return Object.keys(obj).every((_: string) =>
    optionsObjProps.includes(_.toLowerCase())
  );
};
