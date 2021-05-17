import { collectionObj, CollectionDocument, optionsType } from "./types";
import { constructDocument } from "./utils/constructDocument";
import { insertData } from "./utils/data/insertData";

export class Document implements CollectionDocument {
  #options: optionsType;
  #obj: collectionObj;
  [string: string]: any;

  constructor(obj: any, dbObj: collectionObj, options: optionsType) {
    this.#obj = dbObj;
    this.#options = options;

    Object.defineProperty(this, "_save", {
      enumerable: false,
      value: this._save,
    });

    const constructedDoc: any = constructDocument(
      obj,
      this.#obj.schema.properties
    );

    if (constructedDoc.err) console.error(constructedDoc.err);
    else {
      for (let test of Object.keys(constructedDoc)) {
        this[test] = constructedDoc[test];
      }
    }
  }

  async _save(cb?: Function) {
    const checkDoc: any = constructDocument(this, this.#obj.schema.properties);
    if (checkDoc.err) return console.error(checkDoc.err);

    const insert = await insertData([checkDoc], this.#obj, this.#options);

    if (insert.err) {
      if (cb) cb(insert.err, null);
      return insert.err;
    }

    if (cb) cb(null, insert.insertedDocs);
    return insert.insertedDocs;
  }
}
