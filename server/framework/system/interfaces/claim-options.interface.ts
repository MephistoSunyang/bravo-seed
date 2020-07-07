export type IClaimOptions<IModel, IClaimType> = {
  [key in keyof IModel]?: {
    type: IClaimType;
    collections: IModel[key];
  };
};
