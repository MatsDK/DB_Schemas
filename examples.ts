import { Client } from "./lib/Client";
import { DataBase } from "./lib/DataBase";
import { Schema } from "./lib/Schema";

const dbClient = new Client({
  database: "Users",
  host: "127.0.0.1",
  userName: "user",
  passWord: "password",
  port: 1234,
});

const dataBase = dbClient.connect((err, res) => {
  if (err) return console.log("Error: " + err);
  console.log(res);
});

if (dataBase instanceof DataBase) {
  // const PostSchema: Schema = new Schema({
  //   content: String,
  //   comments: [{ text: { type: String, default: "" }, timeStamp: String }],
  // });

  // const userSchema: Schema = new Schema({
  //   name: { firstName: {}, lastName: [String] },
  //   age: { type: Number, unique: true, default: 0 },

  //   posts: [PostSchema],
  // });

  // dataBase.createCollection({ name: "user", schema: userSchema });

  console.log(dataBase.collections);
}
