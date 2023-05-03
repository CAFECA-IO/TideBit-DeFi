import Image from 'next/image';
import React, {useEffect} from 'react';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {TypeOfBorderColor} from '../../constants/display';
import QRCode from 'qrcode';
import useStateRef from 'react-usestateref';
import QRCodeLib from 'qrcode';
import {qrRender} from '../../lib/qrCodeGenerator';
import QrCodeSvg from './qr_code_svg';

interface IRecordSharingBoxProps {
  // TODO: accept props from globalContext (20230502 - Shirley)
  // ticker: string;
  // user: string;
  // cfd: IAcceptedCFDOrder;
  boxVisible: boolean;
  boxRef: React.RefObject<HTMLDivElement>;
  boxClickHandler: () => void;
}

const RecordSharingBox = ({
  boxVisible = true,
  boxRef,
  boxClickHandler: modalClickHandler,
}: IRecordSharingBoxProps) => {
  const [qrcode, setQrcode, qrcodeRef] = useStateRef<string>('');
  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark: '#010599FF',
      light: '#FFBF60FF',
    },
  };

  const generateQR = async (text: string) => {
    try {
      const qr = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        margin: 3,
        rendererOpts: {
          quality: 1,
        },
      });
      const qrCreated = QRCode.create(text, {
        errorCorrectionLevel: 'H',
        // type: 'image/jpeg',
        // margin: 3,
        // rendererOpts: {
        //   quality: 1,
        // },
      });

      // QRCode.toCanvas(
      //   qrCreated
      //   //   , (err: any, canvas: any) => {
      //   //   if (err) throw err;
      //   //   console.log('canvas', canvas);
      //   // }
      // );

      const qrSvg = qrRender(QRCode.create(text), {color: 'colored'});
      setQrcode(qr);
      // console.log('qrCreated', qrCreated);
      // console.log('qrSvg', qrSvg);
      // console.log('qr', qr);
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    generateQR('https://tidebit-defi.com/');
  }, []);

  const displayedBorderColor = TypeOfBorderColor.LONG;
  const displayedTextColor = 'text-lightGreen5';
  const isDisplayedModal = boxVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div ref={boxRef}>
          <div
            style={{
              backgroundImage: `url('/elements/group_15214.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: 600,
              height: 600,
            }}
            className="flex items-start justify-start"
          >
            <div className="ml-16 mt-12">
              <div className="flex items-center space-x-5">
                {' '}
                <div className="flex items-center space-x-4">
                  <Image src="/asset_icon/eth.svg" width={45} height={45} alt="asset icon" />
                  <h1 className="text-4xl font-normal">Ethereum</h1>
                </div>
                <p className="mt-2 rounded-sm bg-white/80 px-1 text-sm font-bold text-black">
                  Up (Buy)
                </p>
              </div>

              <div className="container ml-14 mt-5 w-full">
                <div
                  className={`${displayedBorderColor} ml-0 w-360px border-1px py-4 text-xs leading-relaxed text-lightWhite`}
                >
                  <div className="flex flex-col justify-center text-center">
                    {/* Info: Avatar (20230502 - Shirley) */}
                    <div className="relative mx-auto inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
                      <span className="text-5xl font-bold text-lightWhite">J</span>
                    </div>
                    {/* Info: PNL percentage (20230502 - Shirley) */}
                    <div className={`text-5xl font-extrabold ${displayedTextColor} mt-5 mb-3`}>
                      ⬆ 17%
                    </div>
                    {/* Info: CFD info (20230502 - Shirley) */}
                    <div className="flex-col space-y-2">
                      <div className="mx-5 flex justify-between text-base text-lightGray">
                        <div className="">Open Price</div>
                        <div className="flex items-end space-x-2 text-white">
                          <p>1313.8</p>
                          <span className="text-xs text-lightGray">USDT</span>
                        </div>
                      </div>
                      <div className="mx-5 flex justify-between text-base text-lightGray">
                        <div className="">Close Price</div>
                        <div className="flex items-end space-x-2 text-white">
                          <p>1383.6</p>
                          <span className="text-xs text-lightGray">USDT</span>
                        </div>
                      </div>
                      <div className="mx-5 flex justify-between text-base text-lightGray">
                        <div className="">Leverage</div>
                        <div className="flex text-white">5x</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pl-370px pt-5">
                {qrcodeRef.current && (
                  <>
                    <Image
                      className="rounded-xl"
                      src={qrcodeRef.current}
                      width={100}
                      height={100}
                      alt="QR Code"
                    />

                    {/* <QrCodeSvg /> */}
                  </>
                )}
                {/* <Image
                  className=""
                  alt="QR Code"
                  src="/elements/tidebit_qrcode.png"
                  width={100}
                  height={100}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default RecordSharingBox;
