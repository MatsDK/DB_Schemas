import { Collection, collectionObj, SchemaType } from "./Collection";
import { optionsType } from "./Client";
import { Schema } from "./Schema";

export type CollectionsManagerObj = {
  [name: string]: collectionObj;
};

export interface createCollObjType {
  schema: Schema;
  name: string;
}

export class DataBase {
  collections: CollectionsManager;
  options: optionsType;

  constructor(obj: CollectionsManagerObj, options: optionsType) {
    this.collections = new CollectionsManager(obj);
    this.options = options;
  }

  createCollection(createCollectionObj: createCollObjType) {
    console.log("create collection", createCollectionObj);
  }
}

class CollectionsManager {
  [collection: string]: Collection;

  constructor(obj: CollectionsManagerObj) {
    Object.keys(obj).forEach((_: string) => {
      this[_] = new Collection(obj[_]) as Collection;
    });
  }
}
