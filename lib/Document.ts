import { collectionObj, CollectionDocument, optionsType } from "./types";

export class Document implements CollectionDocument {
  constructor(obj: any, dbObj: collectionObj, options: optionsType) {
    Object.defineProperty(this, "_save", {
      enumerable: false,
      value: this._save,
    });
    console.log(obj);
  }

  _save() {
    console.log("fjsdklfjslkd");
  }
}
