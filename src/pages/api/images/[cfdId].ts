// import {NextApiRequest, NextApiResponse} from 'next';
// import {renderToString} from 'react-dom/server';
// import {toPng} from 'html-to-image';
// import {JSDOM} from 'jsdom';
// import {
//   ISharingOrder,
//   getDummySharingCFDOrder,
// } from '../../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
// import RecordSharingBox from '../../../components/record_sharing_box/record_sharing_box';
// import {Currency} from '../../../constants/currency';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const {id} = req.query;

//   // Fetch the sharing order data with the given ID
//   const sharingOrder: ISharingOrder = await fetchSharingOrder(id as string);

//   const html = renderToString(<RecordSharingBox order={sharingOrder} />);

//   const dom = new JSDOM(
//     `<!DOCTYPE html><head><link href="https://cdn.tailwindcss.com" rel="stylesheet" /></head><body><div id="root">${html}</div></body>`
//   );

//   try {
//     const img = await toPng(dom.window.document.getElementById('root'), {cacheBust: true});
//     res.setHeader('Content-Type', 'image/png');
//     res.setHeader('Content-Disposition', 'inline');
//     res.send(Buffer.from(img.split(',')[1], 'base64'));
//   } catch (error) {
//     res.status(500).json({error: 'Failed to generate image'});
//   }
// }

// async function fetchSharingOrder(cfdId: string): Promise<ISharingOrder> {
//   // Fetch sharing order data with the given ID from your API or data source
//   // Replace this function with your actual implementation
//   const sharingOrder: ISharingOrder = getDummySharingCFDOrder(Currency.BTC); // Fetch the order data here
//   return sharingOrder;
// }
