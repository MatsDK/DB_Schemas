import { DataBase } from "./DataBase";
import { getDataBase } from "./utils/data/getDataBase";
import {
  CollectionsManagerObj,
  dataBaseData,
  optionsType,
} from "./utils/types";

export class Client {
  options: optionsType;

  constructor(options: optionsType) {
    this.options = options;
  }

  connect(cb?: (err: any, res: any) => void) {
    const db: any = getDataBase(this.options);
    if (db.err) {
      if (cb) return cb(db.err, null);
      return console.error(db.err);
    }

    const { Collections: collections } = db;

    if (cb) cb(null, "> Connected to Database");
    return new DataBase(collections, this.options);
  }
}
