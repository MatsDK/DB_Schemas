import { Client } from "./lib/Client";
import { DataBase } from "./lib/DataBase";
import { Schema } from "./lib/Schema";
import { CollectionDocument } from "./lib/types";

const dbClient = new Client({
  database: "users",
  host: "127.0.0.1",
  userName: "user",
  passWord: "password",
  port: 2345,
});

const test = async () => {
  const db = await dbClient.connect((err, res) => {
    if (err) return console.log("Error: " + err);
    console.log(res);
  });

  if (db instanceof DataBase) {
    // const PostSchema: Schema = new Schema({
    //   content: String,
    //   comments: [{ text: { type: String, default: "" }, timeStamp: String }],
    // });

    // const userSchema: Schema = new Schema({
    //   name: { firstName: { default: "test" }, lastName: [String] },
    //   age: { type: Number, unique: true, default: 0 },

    //   posts: [PostSchema],
    // });

    // await db.createCollection(
    //   { name: "user0", schema: userSchema },
    //   (err, res) => {
    //     if (err) console.log("Error: " + err);
    //     console.log(res);
    //   }
    // );

    db.collections.user0.insertOne(
      { age: 0, name: { lastName: ["fdjksl"] } },
      (err: any, res: any) => {
        console.log(err, res);
      }
    );

    // const newObject: CollectionDocument = new db.collections.user.document({
    //   age: 0,
    // });

    // db.collections.user.insertMany();
    // db.collections.user.insertOne();
  }
};

test();
