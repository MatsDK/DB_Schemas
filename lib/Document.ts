import { collectionObj, CollectionDocument, optionsType } from "./types";

export class Document implements CollectionDocument {
  #options: optionsType;
  #obj: collectionObj;

  constructor(obj: any, dbObj: collectionObj, options: optionsType) {
    this.#obj = dbObj;
    this.#options = options;

    Object.defineProperty(this, "_save", {
      enumerable: false,
      value: this._save,
    });
    console.log(obj);
  }

  _save() {
    console.log("fjsdklfjslkd", this.#obj.schema.properties, this.#options);
  }
}
