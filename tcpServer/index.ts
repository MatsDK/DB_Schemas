import net from "net";
import { eventHandler } from "./EventHandler";

const handleEvents = new eventHandler();

handleEvents.on("getDatabaseData", (data: any) => {
  console.log(data);
  return { user: "fjdskl" };
});

const server = net.createServer((conn) => {
  conn.on("data", (data) => {
    handleEvents.emit(data.toString(), conn);
  });

  conn.once("error", (err) => {
    if (err) throw err;
  });
});

server.listen(2345, "127.0.0.1", () => {
  console.log("server listening");
});
