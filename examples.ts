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
    //     if (err) console.log("Error: " + err);
    //     console.log(res);
    //   }
    // );

    const newObject: CollectionDocument = new db.collections.user.document({
      age: 0,
    });

    newObject._save();
    db.collections.user.insertMany();
    db.collections.user.insertOne();
  }
};

test();
