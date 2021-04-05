import { SchemaRef } from "../SchemaRef";

export const isSchemaRef = (schema: any, thisSchema: any): boolean => {
  return (
    thisSchema.constructor.name ===
    new new SchemaRef(schema).newSchemaRef("", { isArray: false }).constructor
      .name
  );
};

export const isNestedObj = (schema: any, doc: any, key: string): boolean => {
  return (
    typeof schema[key] === "object" &&
    schema[key] !== null &&
    typeof doc[key] === "object" &&
    doc[key] !== null
  );
};

const typeOptions = [
  "defaultValue",
  "required",
  "max",
  "min",
  "type",
  "unique",
];

export const isOptionsObj = (obj: any): boolean => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).every((key: string): boolean => typeOptions.includes(key))
  );
};

const findOptionsKeys = ["limit", "skip"];

export const isFindOptions = (obj: any): boolean => {
  return Object.keys(obj).every((key: string) => findOptionsKeys.includes(key));
};
