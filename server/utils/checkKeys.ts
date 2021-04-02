// https://stackoverflow.com/a/41802619

export const checkKeys = (obj1: any, obj2: any): boolean => {
  const inner = (obj: any): string[] => {
    const result: string[] = [];

    const rec = (obj: any, c: string): void => {
      Object.keys(obj).forEach((e) => {
        if (typeof obj[e] == "object") rec(obj[e], c + e);
        result.push(c + e);
      });
    };
    rec(obj, "");
    return result;
  };

  const keys1 = inner(obj1),
    keys2 = inner(obj2);
  return keys1.every((e) => keys2.includes(e) && keys1.length === keys2.length);
};
