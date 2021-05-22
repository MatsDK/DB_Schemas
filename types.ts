import { Schema } from "./lib/Schema";

export interface optionsType {
  userName: string;
  passWord: string;
  host: string;
  database: string;
  port: number;
}

export interface PropertyType {
  name: string;
  maxLength: number | undefined;
  unique: boolean;
  required: boolean;
  default: any;
  instanceOf: string;
  properties: PropertyType[];
  isArray: boolean;
  isObject: boolean;
}

export interface SchemaType {
  properties: Array<PropertyType>;
}

export interface collectionObj {
  schema: SchemaType;
  _id: string;
  _name: string;
  _strict: boolean;
}

export type CollectionsManagerObj = {
  [name: string]: collectionObj;
};

export interface createCollObjType {
  schema?: Schema;
  name: string;
}

export interface NewSchemaType {
  obj: any;
}

export interface dataBaseData {
  _id: string;
  Collections: CollectionsManagerObj;
}

export type getPropValuesReturn = { err: boolean | string };

export interface insertProps {
  db: string;
  collection: string;
  docs: any[];
  uniqueProps: string[];
}

export interface findDataProps {
  db: string;
  collection: string;
  query: any;
}

export interface updateDocsProps {
  db: string;
  collection: string;
  docs: any[];
  uniqueProps: string[];
}
export interface queryOptionsObj {
  $equals: any;
  $gt: any;
  $lt: any;
  $in: any;
}
