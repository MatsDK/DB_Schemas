import { Client } from "./lib/Client";
import { DataBase } from "./lib/DataBase";
import { Schema } from "./lib/Schema";
import { Collection } from "./lib/Collection";
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
    const User: Collection = db.collections.user;
    // const PostSchema: Schema = new Schema({
    //   content: String,
    //   comments: [
    //     {
    //       text: { type: String, unique: true, default: "" },
    //       timeStamp: String,
    //     },
    //   ],
    // });
    // const userSchema: Schema = new Schema({
    //   name: {
    //     firstName: { default: "test", unique: true },
    //     lastName: [String],
    //   },
    //   age: { type: Number, default: 0 },
    //   posts: [PostSchema],
    // });
    // await db.createCollection(
    //   { name: "user", schema: userSchema },
    //   (err, res) => {
    //     if (err) console.log("Error: " + err);
    //     console.log(res);
    //   }
    // );
    //
    // db.collections.user.insertMany(
    //   [
    //     {
    //       age: 21,
    //       name: { firstName: "this is name" },
    //       posts: [{ content: "content" }],
    //     },
    //   ],
    //   (err: any, res: any) => {
    //     if (err) throw err;
    //     console.log(res);
    //   }
    // );
    //
    // const newObject: CollectionDocument = new db.collections.user.document({
    //   age: 21,
    // });
    // newObject.age = 1;
    // newObject.name = { firstName: "21" };
    // newObject._save((err: any, res: any) => {
    //   if (err) return console.error(err);
    //   console.log(res);
    // });
    //
    await User.findMany(
      {
        orderBy: { age: "Desc" },
        limit: 10,
        skip: 0,
        where: {
          $or: [{ age: { $equals: 20 } }, { age: { $equals: 21 } }],
          // $and: [{ $or: [{ test: "test" }] }],
          name: { firstName: { $equals: "test" } },
        },
      },
      (err: any, res: any) => {
        res[0].age = 22;

        res[0]._save((err: any, res: any) => {
          if (err) return console.error(err);
          console.log(res);
        });
      }
    );
  }
};

test();
