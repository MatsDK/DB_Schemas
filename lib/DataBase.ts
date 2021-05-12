import { Collection } from "./Collection";
import { defaultCollectionObj } from "./utils/constants";
import {
  collectionObj,
  CollectionsManagerObj,
  createCollObjType,
  optionsType,
} from "./utils/types";
import { v4 as uuid } from "uuid";
import { createCollection } from "./utils/data/createCollection";

export class DataBase {
  collections: CollectionsManager;
  options: optionsType;

  constructor(obj: CollectionsManagerObj, options: optionsType) {
    this.collections = new CollectionsManager(obj, options);
    this.options = options;
  }

  createCollection(createCollectionObj: createCollObjType) {
    if (!createCollectionObj.name.trim())
      return "Give a valid name for a collection";

    const newCollectionObj: collectionObj = {
      ...defaultCollectionObj,
      _name: createCollectionObj.name.trim(),
      _strict: !!createCollectionObj.schema,
      _id: uuid(),
    };

    if (newCollectionObj._strict)
      newCollectionObj.schema = createCollectionObj.schema?._schema;

    const newCollection = createCollection(newCollectionObj, this.options);
    if (newCollection.err) return console.error(newCollection.err);

    if (newCollection.collections)
      this.collections = new CollectionsManager(
        newCollection.collections,
        this.options
      );
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
