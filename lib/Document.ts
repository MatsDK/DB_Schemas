import { collectionObj, CollectionDocument, optionsType } from "./types";
import { constructDocument } from "./utils/constructDocument";
import { insertData, getUniquePropsRecursive } from "./utils/data/insertData";
import { updateDocs } from "./utils/data/updateDocs";

export class Document implements CollectionDocument {
  #options: optionsType;
  #obj: collectionObj;
  #isNewDoc: boolean;
  [string: string]: any;
  _id?: string;

  constructor(
    obj: any,
    dbObj: collectionObj,
    options: optionsType,
    properties: any
  ) {
    this.#obj = dbObj;
    this.#options = options;
    this.#isNewDoc = properties.complete;

    Object.defineProperty(this, "_save", {
      enumerable: false,
      value: this._save,
    });

    const constructedDoc: any = constructDocument(
      obj,
      this.#obj.schema.properties,
      properties.complete
    );

    if (constructedDoc.err) console.error(constructedDoc.err);
    else {
      for (let test of Object.keys(constructedDoc)) {
        this[test] = constructedDoc[test];
      }
    }
  }

  async _save(cb?: Function) {
    if (this.#isNewDoc) {
      const checkDoc: any = constructDocument(
        this,
        this.#obj.schema.properties,
        true
      );

      if (checkDoc.err) return console.error(checkDoc.err);

      const insert = await insertData([checkDoc], this.#obj, this.#options);

      if (insert.err) {
        if (cb) cb(insert.err, null);
        return insert.err;
      }

      if (cb) cb(null, insert.insertedDocs);
      return insert.insertedDocs;
    } else {
      const thisDocId = this._id,
        thisDoc = { ...this };
      delete thisDoc._id;

      const thisConstructedDoc = constructDocument(
        thisDoc,
        this.#obj.schema.properties,
        this.#isNewDoc
      );
      thisConstructedDoc._id = thisDocId;

      const uniqueProps: string[] = getUniquePropsRecursive(
        this.#obj.schema.properties
      );

      const update = await updateDocs(
        [thisConstructedDoc],
        this.#obj,
        this.#options,
        uniqueProps
      );
      console.log(update);
    }
  }
}
