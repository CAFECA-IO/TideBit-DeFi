export type ICFDOperation = 'CREATE' | 'UPDATE' | 'CLOSE';

export type ICFDOperationConstant = {
  CREATE: ICFDOperation;
  UPDATE: ICFDOperation;
  CLOSE: ICFDOperation;
};

export const CFDOperation: ICFDOperationConstant = {
  CREATE: 'CREATE',
  CLOSE: 'CLOSE',
  UPDATE: 'UPDATE',
};
