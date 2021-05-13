interface queryObj {
  eventName: string;
  data?: any;
}

export class eventHandler {
  events: Map<string, Function>;

  constructor() {
    this.events = new Map();
  }

  async emit(data: any, conn: any) {
    try {
      const queryObj: queryObj = JSON.parse(data),
        thisEvent = this.events.get(queryObj?.eventName?.trim()?.toLowerCase());

      if (!thisEvent) return conn.write({ err: "Query not found" });

      const returnData: Promise<any> = await thisEvent(queryObj.data);
      conn.write(JSON.stringify({ data: returnData }));
    } catch (err) {
      console.log(err);
      conn.write({ err: true });
    }
  }

  on(eventName: string, event: Function) {
    const name: string = eventName.trim().toLowerCase();
    if (!this.events.get(name)) this.events.set(name, event);
  }
}
