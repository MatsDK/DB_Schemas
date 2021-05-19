import { getPropValuesReturn } from "../../../types";

export const checkIfUniqueValue = (
  uniqueProps: string[],
  newDocs: any[],
  docs: any[]
) => {
  // console.log(newDocs, docs);
  for (const prop of uniqueProps) {
    const checkProp: getPropValuesReturn = getPropertyValues(
      [...newDocs, ...docs],
      prop.split(".")
    );

    if (checkProp.err) return checkProp;
  }

  return { err: false };
};

const getPropertyValues = (
  docs: any[],
  property: string[]
): getPropValuesReturn => {
  if (property.length === 1) {
    const findDuplicates = new Set();

    for (const [i, doc] of docs.entries()) {
      findDuplicates.add(doc[property[0]]);
      if (i != findDuplicates.size - 1)
        return { err: `'${property[0]}: ${doc[property[0]]}' is not unique` };
    }
  } else {
    const checkRecursive: getPropValuesReturn = getPropertyValues(
      docs.map((_: any) => _[property[0]]),
      property.slice(1)
    );

    if (checkRecursive.err) return checkRecursive;
  }

  return { err: false };
};
