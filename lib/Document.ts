import { filterData } from "../tcpServer/handlers/helpers/filterData";
import {
  collectionObj,
  CollectionDocument,
  optionsType,
  returningType,
  PropertyType,
} from "./types";
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
    properties: any,
    returnProps?: any
  ) {
    this.#obj = dbObj;
    this.#options = options;
    this.#isNewDoc = properties.complete;

    Object.defineProperty(this, "_save", {
      enumerable: false,
      value: this._save,
    });

    let constructedDoc: any;
    if (returnProps) {
      const NewSchemaProperties = filterSchemaProperties(
        returnProps,
        this.#obj.schema.properties
      );
      constructedDoc = constructDocument(
        obj,
        NewSchemaProperties,
        properties.complete
      );
    } else {
      constructedDoc = constructDocument(
        obj,
        this.#obj.schema.properties,
        properties.complete
      );
    }

    if (constructedDoc.err) console.error(constructedDoc.err);
    else {
      for (let key of Object.keys(constructedDoc)) {
        this[key] = constructedDoc[key];
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

      if (update.err) {
        if (cb) cb(update.err, null);
        return update.err;
      }

      if (cb) cb(null, update.updatedDocs[0]);
      return update.updatedDocs[0];
    }
  }
}
const filterSchemaProperties = (
  returnProps: returningType,
  schemaProperties: PropertyType[]
): PropertyType[] => {
  let returningProperties: Array<PropertyType | undefined> = [];

  Object.entries(returnProps).forEach(
    ([key, value]: [string, boolean | returningType]) => {
      if (typeof value == "boolean" && value)
        returningProperties = [
          schemaProperties.find((_: PropertyType) => _.name == key) ||
            undefined,
          ...returningProperties,
        ];
      else {
        const thisProperty: PropertyType | undefined = schemaProperties.find(
            (_) => _.name == key
          ),
          recursiveProperties = filterSchemaProperties(
            value as returningType,
            thisProperty?.properties || []
          );

        if (recursiveProperties.length && thisProperty) {
          thisProperty.properties = recursiveProperties as PropertyType[];
          returningProperties.push(thisProperty);
        }
      }
    }
  );

  return returningProperties.filter((_) => !!_) as PropertyType[];
};
