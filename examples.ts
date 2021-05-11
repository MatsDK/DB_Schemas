import { DbClient } from "./lib/Client";
import { DataBase } from "./lib/DataBase";
import { Schema } from "./lib/Schema";

const Client = new DbClient({
  database: "Users",
  host: "127.0.0.1",
  userName: "mats",
  passWord: "mats",
  port: 1234,
});

const dataBase: DataBase = Client.connect((err, res) => {
  if (err) throw err;
  console.log(res);
});

// dataBase.createCollection({
//   name: "users",
//   schema: new Schema({
//     name: String,
//     age: Number,
//   }),
// })
const PostSchema = new Schema({
  content: String,
});

new Schema({
  name: { firstName: {}, lastName: [String] },
  age: { type: Number, unique: true, default: 0 },

  posts: [PostSchema],
});
// console.log(dataBase.collections.users.schema);
