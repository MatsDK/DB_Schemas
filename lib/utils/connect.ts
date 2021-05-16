import net from "net";

interface queryObj {
  eventName: string;
  data?: any;
}
interface connConfProps {
  port: number;
  host: string;
}

export const connect = async (
  { port, host }: connConfProps,
  query: queryObj
): Promise<any> => {
  try {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(resolve, 2000, { err: "Database doesn't respond" });
    });

    const connect = new Promise((resolve, reject) => {
      const client = net.createConnection(port, host, () => {
        client.write(JSON.stringify(query));
      });

      client.once("data", (data) => {
        resolve(JSON.parse(data.toString()).data);
        client.end();
      });

      client.once("close", () => {});
      client.once("error", () => reject);
    });

    return await Promise.race([connect, timeout]);
  } catch (err) {
    return { err: err.message };
  }
};
