import { DataBase } from "./DataBase";

export interface optionsType {
  userName: string;
  passWord: string;
  host: string;
  database: string;
  port: number;
}

export class DbClient {
  options: optionsType;

  constructor(options: optionsType) {
    this.options = options;
  }

  connect(cb?: (err: any, res: any) => void) {
    if (cb) cb(null, "> Connected to Database");

    return new DataBase(obj, this.options);
  }
}

const obj: any = {
  users: {
    test: "fjdskl",
  },
  posts: {
    test: "2",
  },
};
