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

      client.once("data", (data: any) => {
        client.end();

        data = JSON.parse(data.toString());
        if (data.err) resolve(data);
        else resolve(data.data);
      });

      client.once("close", () => {});
      client.once("error", () => reject);
    });

    return await Promise.race([connect, timeout]);
  } catch (err) {
    console.log(err);
    return { err: err.message };
  }
};
