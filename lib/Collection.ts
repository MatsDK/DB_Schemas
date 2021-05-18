import { collectionObj, optionsType, PropertyType, SchemaType } from "./types";
import { Document } from "./Document";
import { constructDocument } from "./utils/constructDocument";
import { insertHandlers } from "./utils/data/insertData";
import { findData } from "./utils/data/queryData";

type cb = (err: string | null, res: any) => void;

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

  async insertOne(obj: any, cb?: cb) {
    if (typeof obj !== "object" || obj == null)
      return console.error("Please give an object you wan't to insert");

    let insertDoc: any = obj;
    if (this.#obj._strict) {
      const constructedDoc = constructDocument(
        obj,
        this.#obj.schema.properties
      );
      if (constructedDoc.err) {
        if (cb) cb(constructedDoc.err, null);
        return constructedDoc.err;
      }

      insertDoc = constructedDoc;
    }

    return await insertHandlers([insertDoc], this.#obj, this.#options, cb);
  }

  async insertMany(objs: any[], cb?: cb) {
    if (!Array.isArray(objs) || objs.length < 1)
      return console.error(
        "Please give an array of objects you wan't to insert"
      );

    const insertDocs: any[] = [];
    for (const obj of objs) {
      let insertDoc: any = obj;
      if (this.#obj._strict) {
        const constructedDoc = constructDocument(
          obj,
          this.#obj.schema.properties
        );
        if (constructedDoc.err) {
          if (cb) cb(constructedDoc.err, null);
          return constructedDoc.err;
        }

        insertDoc = constructedDoc;
      }
      insertDocs.push(insertDoc);
    }

    return await insertHandlers(insertDocs, this.#obj, this.#options, cb);
  }

  async findMany(searchQuery?: any | cb, cb?: cb) {
    if (typeof searchQuery === "function" && !cb) cb = searchQuery;

    const foundDocs: any = await findData({}, {}, this.#obj, this.#options);
    if (foundDocs.err) {
      if (cb) cb(foundDocs.err, null);
      return foundDocs.err;
    }

    if (cb) cb(null, foundDocs.docs);
    return foundDocs.docs;
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
