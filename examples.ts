import { Client } from "./lib/Client";
import { DataBase } from "./lib/DataBase";
import { Schema } from "./lib/Schema";

const dbClient = new Client({
  database: "users",
  host: "127.0.0.1",
  userName: "user",
  passWord: "password",
  port: 2345,
});

const dataBase = dbClient.connect((err, res) => {
  if (err) return console.log("Error: " + err);
  console.log(res);
});

const test = async (db: any) => {
  if (db instanceof DataBase) {
    const PostSchema: Schema = new Schema({
      content: String,
      comments: [{ text: { type: String, default: "" }, timeStamp: String }],
    });

    const userSchema: Schema = new Schema({
      name: { firstName: {}, lastName: [String] },
      age: { type: Number, unique: true, default: 0 },

      posts: [PostSchema],
    });

    // await db.createCollection(
    //   { name: "user", schema: userSchema },
    //   (err, res) => {
    //     if (err) return console.log("Error: " + err);
    //     console.log(res);
    //   }
    // );

    console.log(db.collections, userSchema._schema.properties);
  }
};

test(dataBase);
