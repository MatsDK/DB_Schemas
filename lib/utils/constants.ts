import { PropertyType } from "../Collection";

export const types: string[] = ["String", "Boolean", "Number", "Any"];
export const defaultPropertyObj: PropertyType = {
  name: "",
  instanceOf: "Any",
  maxLength: undefined,
  unique: false,
  required: false,
  default: undefined,
};
