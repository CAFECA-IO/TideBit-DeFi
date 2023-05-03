import {NextApiRequest, NextApiResponse} from 'next';
import {CFDOperation} from '../../../../constants/cfd_order_type';
import {Code, Reason} from '../../../../constants/code';
import {
  dummyAcceptedCFDOrders,
  IAcceptedCFDOrder,
} from '../../../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {
  convertApplyCloseCFDToAcceptedCFD,
  convertApplyCreateCFDToAcceptedCFD,
  convertApplyUpdateCFDToAcceptedCFD,
} from '../../../../interfaces/tidebit_defi_background/apply_cfd_order';
import {randomHex} from '../../../../lib/common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const cfds: IAcceptedCFDOrder[] = [...dummyAcceptedCFDOrders];
    res.status(200).json(cfds);
  } else {
    try {
      if (req.method === 'POST') {
        if (req.body.applyData.operation === CFDOperation.CREATE) {
          const acceptedCFDOrder = convertApplyCreateCFDToAcceptedCFD(
            req.body.applyData,
            req.body.balance,
            req.body.userSignature,
            randomHex(32),
            randomHex(32)
          );
          res.status(200).json(acceptedCFDOrder);
        } else res.status(500).json({error: 'Internal Server Error'});
      } else if (req.method === 'PUT') {
        if (req.body.applyData.operation === CFDOperation.CLOSE) {
          const {updateCFDOrder, acceptedCFDOrder} = convertApplyCloseCFDToAcceptedCFD(
            req.body.applyData,
            req.body.openCFD,
            req.body.balance,
            req.body.userSignature,
            randomHex(32),
            randomHex(32)
          );
          res.status(200).json({updateCFDOrder, acceptedCFDOrder});
        } else if (req.body.applyData.operation === CFDOperation.UPDATE) {
          const {updateCFDOrder, acceptedCFDOrder} = convertApplyUpdateCFDToAcceptedCFD(
            req.body.applyData,
            req.body.openCFD,
            req.body.balance,
            req.body.userSignature,
            randomHex(32),
            randomHex(32)
          );
          res.status(200).json({updateCFDOrder, acceptedCFDOrder});
        } else res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
      }
    } catch (error) {
      // Deprecated: after finish error handle (20230423 - tzuhan)
      // eslint-disable-next-line no-console
      console.error(`cfds error`, error);
      res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
    }
  }
}
