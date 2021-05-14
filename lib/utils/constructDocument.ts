import { PropertyType } from "../types";

export const constructDocument = (doc: any, props: Array<PropertyType>) => {
  const constructedDoc: any = {};

  for (let thisProp of props) {
    const key: string = thisProp.name;

    if (doc[key] != null) {
      if (!thisProp.isObject && !thisProp.isArray) {
        if (checkType(thisProp, doc[key])) {
          return {
            err: `Property '${key}' has wrong type, expected ${thisProp.instanceOf}`,
          };
        }

        constructedDoc[key] = doc[key];
      } else if (thisProp.isObject && !thisProp.isArray) {
        constructedDoc[key] = constructDocument(doc[key], thisProp.properties);
      } else if (thisProp.isArray) {
        if (!Array.isArray(doc[key]))
          return { err: `Property '${key}' should be an array` };

        console.log(thisProp.isObject);
      }
    } else {
      if (!thisProp.isObject && !thisProp.isArray) {
        constructedDoc[key] = thisProp.default;
      } else if (thisProp.isObject && !thisProp.isArray) {
        constructedDoc[key] = constructDocument({}, thisProp.properties);
      } else if (thisProp.isArray) {
        constructedDoc[key] = [];
      }
    }
  }
  // console.log(constructedDoc);
  return constructedDoc;
};

const checkType = (thisProp: PropertyType, obj: any): boolean => {
  return (
    thisProp.instanceOf.toLowerCase() != typeof obj &&
    thisProp.instanceOf != "Any"
  );
};
