import { Collection } from "./Collection";
import { defaultCollectionObj } from "./utils/constants";
import {
  collectionObj,
  CollectionsManagerObj,
  createCollObjType,
  optionsType,
} from "./types";
import { v4 as uuid } from "uuid";
import { createCollection } from "./utils/data/createCollection";
import { Document } from "./Document";

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
    if (!createCollectionObj.name.trim()) {
      if (cb) return cb("Give a valid name for a collection", null);
      return console.error("Give a valid name for a collection");
    }

    const newCollectionObj: collectionObj = {
      ...defaultCollectionObj,
      _name: createCollectionObj.name.trim(),
      _strict: !!createCollectionObj.schema,
      _id: uuid(),
    };

    if (newCollectionObj._strict)
      newCollectionObj.schema = createCollectionObj.schema?._schema;

    const newCollection = await createCollection(
      newCollectionObj,
      this.options
    );

    if (newCollection.err) {
      if (cb) return cb(newCollection.err, null);
      return console.error(newCollection.err);
    }

    const { data } = newCollection;
    if (data) this.collections = new CollectionsManager(data, this.options);

    if (cb) cb(null, `Created collection '${newCollectionObj._name}'`);
    return `Created collection '${newCollectionObj._name}'`;
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
