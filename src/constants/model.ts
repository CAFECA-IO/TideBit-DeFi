// TODO: Create a static object of the prediction model class
export type IModel = 'Linear Regression';

export interface IModelConstant {
  LINEAR_REGRESSION: IModel;
}
export const Model: IModelConstant = {
  LINEAR_REGRESSION: 'Linear Regression',
};
