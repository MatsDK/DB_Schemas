import { PropertyType, SchemaType } from "./Collection";
import { defaultPropertyObj, types } from "./utils/constants";

interface NewSchemaType {
  obj: any;
}

export class Schema implements NewSchemaType {
  obj: any;

  constructor(obj: any) {
    const objKeys: string[] = Object.keys(obj);
    const schemaObj: SchemaType = { properties: [] };

    for (let key of objKeys) {
      // Check if type directly declared in schema
      if (typeof obj[key] === "function" && types.includes(obj[key].name)) {
        const thisPropertyType: string | undefined = types.find(
          (_: string) => _ === obj[key].name
        );

        schemaObj.properties.push({
          ...defaultPropertyObj,
          name: key,
          instanceOf: thisPropertyType || "Any",
        });

        continue;
      }

      console.log(key, obj[key], obj[key]);
      // Check if options Object is declared
    }

    console.log(schemaObj);
    this.obj = obj;
  }
}
