export type ICFDOrderType = 'CREATE' | 'UPDATE' | 'CLOSE';

export type ICFDOrderTypeConstant = {
  CREATE: ICFDOrderType;
  UPDATE: ICFDOrderType;
  CLOSE: ICFDOrderType;
};

export const CFDOrderType: ICFDOrderTypeConstant = {
  CREATE: 'CREATE',
  CLOSE: 'CLOSE',
  UPDATE: 'UPDATE',
};
