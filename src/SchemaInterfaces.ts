export interface SchemaRefOptionsProps {
  isArray: boolean;
}

export interface ModelReturnProps {
  modelName: string;
  schema: any;
  Model: any;
  findOne: any;
  find: any;
  update: any;
}

export interface checkModelRecursiveRet {
  err: boolean;
  doc?: any;
  errData?: string;
}
