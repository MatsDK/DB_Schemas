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
    return new Promise((resolve, reject) => {
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
  } catch (err) {
    return { err: err.message };
  }
};
