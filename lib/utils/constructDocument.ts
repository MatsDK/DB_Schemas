import { PropertyType } from "../types";
import { forbiddenProps } from "./constants";

export const constructDocument = (
  doc: any,
  props: Array<PropertyType>,
  complete: boolean
) => {
  const constructedDoc: any = {};

  for (const key of Object.keys(doc)) {
    if (forbiddenProps.includes(key.toLowerCase()))
      return {
        err: `You can't have the property '${key}' declared on your document`,
      };
  }

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
        const constrRecursive: any = constructDocument(
          doc[key],
          thisProp.properties,
          complete
        );

        if (constrRecursive.err) return constrRecursive;

        constructedDoc[key] = constrRecursive;
      } else if (thisProp.isArray) {
        if (!Array.isArray(doc[key]))
          return { err: `Property '${key}' should be an array` };

        const newArr: any[] = [];
        if (doc[key].length) {
          for (let arrayObj of doc[key]) {
            if (thisProp.isObject) {
              if (typeof arrayObj !== "object" || arrayObj == null)
                return { err: `Property ${key} should be an array of object` };

              const checkArrayObj: any = constructDocument(
                arrayObj,
                thisProp.properties,
                complete
              );
              if (checkArrayObj.err) return checkArrayObj;

              newArr.push(checkArrayObj);
            } else if (typeof arrayObj != thisProp.instanceOf.toLowerCase()) {
              return {
                err: `Array '${key}' has incorrect types, expected ${thisProp.instanceOf}`,
              };
            } else newArr.push(arrayObj);
          }
        }

        constructedDoc[key] = newArr;
      }
    } else {
      if (!thisProp.isObject && !thisProp.isArray) {
        if (complete) constructedDoc[key] = thisProp.default;
      } else if (thisProp.isObject && !thisProp.isArray) {
        const constrRecursive: any = constructDocument(
          {},
          thisProp.properties,
          complete
        );

        if (constrRecursive.err) return constrRecursive;

        constructedDoc[key] = constrRecursive;
      } else if (thisProp.isArray) {
        constructedDoc[key] = [];
      }
    }
  }

  return constructedDoc;
};

const checkType = (thisProp: PropertyType, obj: any): boolean => {
  return (
    thisProp.instanceOf.toLowerCase() != typeof obj &&
    thisProp.instanceOf != "Any"
  );
};
