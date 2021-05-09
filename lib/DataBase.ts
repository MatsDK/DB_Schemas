import { Collection } from "./Collection";
import { optionsType } from "./Client";

export class DataBase {
  collections: CollectionsManager;
  options: optionsType;

  constructor(obj: any, options: optionsType) {
    this.collections = new CollectionsManager(obj);
    this.options = options;
  }

  createCollection() {
    console.log("create collection");
  }
}

class CollectionsManager {
  [collection: string]: Collection;

  constructor(obj: any) {
    Object.keys(obj).forEach((_: string) => {
      this[_] = new Collection(obj[_]) as Collection;
    });
  }
}
