import { collectionObj, optionsType, PropertyType, SchemaType } from "./types";
import { Document } from "./Document";
import { constructDocument } from "./utils/constructDocument";

export class Collection {
  schema: CollectionSchema;
  _id: string;
  #options: optionsType;
  #obj: collectionObj;
  document: any;

  constructor(obj: collectionObj, options: optionsType) {
    this.schema = new CollectionSchema(obj.schema);
    this.#options = options;
    this._id = obj._id;
    this.#obj = obj;
    this.document = class constructObj {
      constructor(dataObj: any) {
        return new Document(dataObj, obj, options);
      }
    };
  }

  insertOne(obj: any, cb?: Function) {
    if (typeof obj !== "object" || obj == null)
      return console.error("Please give an objecy you wan't to insert");

    if (this.#obj._strict) {
      console.log(constructDocument(obj, this.#obj.schema.properties));
    }
  }

  insertMany() {
    console.log("insert many documents");
  }

  findMany() {
    console.log("find many");
  }
}

class CollectionSchema {
  [propertyName: string]: PropertyType;

  constructor(schema: SchemaType) {
    for (let property of schema.properties) {
      this[property.name as string] = property as PropertyType;
    }
  }
}
