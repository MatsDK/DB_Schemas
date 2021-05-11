import { CollectionsManagerObj, DataBase } from "./DataBase";

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

const obj: CollectionsManagerObj = {
  users: {
    _id: "d89e69d8-9c2d-44bb-a117-17e5117fbae7",
    _name: "users",
    schema: {
      properties: [
        {
          properties: [],
          isArray: false,
          name: "name",
          instanceOf: "String",
          maxLength: 100,
          required: false,
          unique: false,
          default: undefined,
          isObject: false,
        },
        {
          properties: [],
          isArray: false,
          name: "age",
          instanceOf: "String",
          maxLength: undefined,
          required: false,
          unique: false,
          default: undefined,
          isObject: false,
        },
      ],
    },
  },
  posts: {
    _id: "ee9e69d8-9c2d-44bb-a117-17e5117fbae7",

    _name: "posts",
    schema: {
      properties: [
        {
          properties: [],
          isArray: false,
          name: "content",
          maxLength: 100,
          instanceOf: "Any",
          required: true,
          unique: true,
          default: "content",
          isObject: false,
        },
      ],
    },
  },
};
