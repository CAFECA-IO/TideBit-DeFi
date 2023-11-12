export interface IErrorItem {
  reason: string;
  code: string;
  message: string;
  where: string;
  when: number;
}

export interface IException {
  level: number;
  item: IErrorItem;
}

export type IErrorSearchProps = 'WHERE' | 'MESSAGE' | 'CODE' | 'EXCEPTION' | 'LEVEL';

export interface IErrorSearchPropsConstant {
  WHERE: IErrorSearchProps;
  MESSAGE: IErrorSearchProps;
  CODE: IErrorSearchProps;
  EXCEPTION: IErrorSearchProps;
  LEVEL: IErrorSearchProps;
}
export const ErrorSearchProps: IErrorSearchPropsConstant = {
  WHERE: 'WHERE',
  MESSAGE: 'MESSAGE',
  CODE: 'CODE',
  EXCEPTION: 'EXCEPTION',
  LEVEL: 'LEVEL',
};

export function isException(item: unknown): item is IException {
  const possibleException = item as IException;
  return (
    possibleException !== null &&
    typeof possibleException === 'object' &&
    typeof possibleException.level === 'number' &&
    typeof possibleException.item === 'object' &&
    typeof possibleException.item.reason === 'string' &&
    typeof possibleException.item.code === 'string' &&
    typeof possibleException.item.message === 'string' &&
    typeof possibleException.item.where === 'string' &&
    typeof possibleException.item.when === 'number'
  );
}
