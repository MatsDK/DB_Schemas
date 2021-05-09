import { DbClient } from "./lib/Client";
import { DataBase } from "./lib/DataBase";

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

console.log(dataBase);
console.log(dataBase.collections);
