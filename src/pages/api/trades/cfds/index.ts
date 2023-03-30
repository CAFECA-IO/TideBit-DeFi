import {NextApiRequest, NextApiResponse} from 'next';
import {CFDOperation} from '../../../../constants/cfd_order_type';
import {Code, Reason} from '../../../../constants/code';
import {IAcceptedCFDOrder} from '../../../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {
  convertApplyCloseCFDToAcceptedCFD,
  convertApplyCreateCFDToAcceptedCFD,
  convertApplyUpdateCFDToAcceptedCFD,
} from '../../../../interfaces/tidebit_defi_background/apply_cfd_order';
// Deprecated: remove when backend is ready (20230424 - tzuhan)
// let acceptedCFDOrders: IAcceptedCFDOrder[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    /* TODO: dummyAcceptedCFDOrder (20230330 - tzuhan) */
    const cfds: IAcceptedCFDOrder[] = []; // req.query.ticker ? getDummyAcceptedCFDs(req.query.ticker as string) : [];
    // Deprecated: remove when backend is ready (20230424 - tzuhan)
    // acceptedCFDOrders = acceptedCFDOrders.concat(cfds);
    res.status(200).json(cfds);
  } else {
    try {
      if (req.method === 'POST') {
        if (req.body.applyData.operation === CFDOperation.CREATE) {
          const nodeSignature = '0x';
          const acceptedCFDOrder = convertApplyCreateCFDToAcceptedCFD(
            req.body.applyData,
            req.body.balance,
            req.body.userSignature,
            nodeSignature
          );
          // Deprecated: remove when backend is ready (20230424 - tzuhan)
          // acceptedCFDOrders = [...acceptedCFDOrders, acceptedCFDOrder];

          res.status(200).json(acceptedCFDOrder);
        } else res.status(500).json({error: 'Internal Server Error'});
      } else if (req.method === 'PUT') {
        if (req.body.applyData.operation === CFDOperation.CLOSE) {
          const nodeSignature = '0x';
          // Deprecated: remove when backend is ready (20230424 - tzuhan)
          // const index = acceptedCFDOrders.findIndex(o => o.id === req.body.data.orderId);
          // if (index !== -1) {
          const acceptedClosedCFDOrder = convertApplyCloseCFDToAcceptedCFD(
            req.body.applyData,
            req.body.openCFD,
            req.body.balance,
            req.body.userSignature,
            nodeSignature
          );
          // acceptedCFDOrders[index] = acceptedClosedCFDOrder;
          res.status(200).json(acceptedClosedCFDOrder);
          // } else res.status(501).json({error: 'order not found'});
        } else if (req.body.applyData.operation === CFDOperation.UPDATE) {
          const nodeSignature = '0x';
          // Deprecated: remove when backend is ready (20230424 - tzuhan)
          // const index = acceptedCFDOrders.findIndex(o => o.id === req.body.data.orderId);
          // if (index !== -1) {
          const acceptedUpdatedCFDOrder = convertApplyUpdateCFDToAcceptedCFD(
            req.body.applyData,
            req.body.openCFD,
            req.body.userSignature,
            nodeSignature
          );
          // acceptedCFDOrders[index] = acceptedUpdatedCFDOrder;
          res.status(200).json(acceptedUpdatedCFDOrder);
          // } else res.status(501).json({error: 'order not found'});
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
