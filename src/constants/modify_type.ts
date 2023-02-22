export type IModifyType = 'Add' | 'REMOVE' | 'UPDATE';
export interface IModifyTypeConstant {
  Add: IModifyType;
  REMOVE: IModifyType;
  UPDATE: IModifyType;
}
export const ModifyType: IModifyTypeConstant = {
  Add: 'Add',
  REMOVE: 'REMOVE',
  UPDATE: 'UPDATE',
};
