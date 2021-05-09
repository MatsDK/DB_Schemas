export class Collection {
  #obj: any;

  constructor(obj: any) {
    this.#obj = obj;
  }

  findMany() {
    console.log("find many");
  }
}
