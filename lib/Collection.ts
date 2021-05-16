import { collectionObj, optionsType, PropertyType, SchemaType } from "./types";
import { Document } from "./Document";
import { constructDocument } from "./utils/constructDocument";
import { insertData } from "./utils/data/insertData";

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

  async insertOne(obj: any, cb?: (err: string | null, res: any) => void) {
    if (typeof obj !== "object" || obj == null)
      return console.error("Please give an objecy you wan't to insert");

    let insertDoc: any = obj;
    if (this.#obj._strict) {
      const constructedDoc = constructDocument(
        obj,
        this.#obj.schema.properties
      );
      if (constructedDoc.err) return console.log(constructedDoc.err);

      insertDoc = constructedDoc;
    }

    const insert = await insertData([insertDoc], this.#obj, this.#options);
    if (insert.err) {
      if (cb) cb(insert.err, null);
      return insert.err;
    }

    if (cb) cb(null, insert.insertedDocs);
    return insert.insertedDocs;
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
