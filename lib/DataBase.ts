import { Collection } from "./Collection";
import { CollectionsManagerObj, createCollObjType, optionsType } from "./types";
import { createCollection } from "./utils/data/createCollection";

export class DataBase {
  collections: CollectionsManager;
  options: optionsType;

  constructor(obj: CollectionsManagerObj, options: optionsType) {
    this.collections = new CollectionsManager(obj, options);
    this.options = options;
  }

  async createCollection(
    createCollectionObj: createCollObjType,
    cb?: (err: any, res: any) => any
  ): Promise<any> {
    const createColRes = await createCollection(
      this.options,
      createCollectionObj
    );

    if (createColRes.err) {
      if (cb) cb(createColRes.err, null);
      return `Error: ${createColRes.err}`;
    }

    if (createColRes.data)
      this.collections = new CollectionsManager(
        createColRes.data,
        this.options
      );

    if (cb) cb(null, `Created collection '${createCollectionObj.name}'`);
    return `Created collection '${createCollectionObj.name}'`;
  }
}

class CollectionsManager {
  [collection: string]: Collection;

  constructor(obj: CollectionsManagerObj, options: optionsType) {
    Object.keys(obj).forEach((_: string) => {
      this[_] = new Collection(obj[_], options) as Collection;
    });
  }
}
