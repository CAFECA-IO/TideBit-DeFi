import Image from 'next/image';
import React, {useEffect} from 'react';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {TypeOfBorderColor} from '../../constants/display';
import QRCode from 'qrcode';
import useStateRef from 'react-usestateref';
import QRCodeLib from 'qrcode';
import {qrRender} from '../../lib/qrCodeGeneratorTest1';
import {generateQRCodeWithStyledEyeBorders} from '../../lib/qrCodeGenerator';
import CustomQRCode from './custom_qr_code';

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
  const url = `https://tidebit-defi.com/`;
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

      const qrDIY = await generateQRCodeWithStyledEyeBorders(text);

      const qrSvg = qrRender(QRCode.create(text), {color: 'colored'});
      setQrcode(qr);
      // console.log('qrCreated', qrCreated);
      // console.log('qrSvg', qrSvg);
      // console.log('qr', qr);
      // console.log('qrDIY', qrDIY);
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
                    <CustomQRCode text={url} />
                    {/* <Image
                      className="rounded-xl"
                      src={qrcodeRef.current}
                      width={100}
                      height={100}
                      alt="QR Code"
                    /> */}

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
              <div>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 33 33"
                  shape-rendering="crispEdges"
                >
                  <path fill="#ffffff" d="M0 0h33v33H0z" />
                  <path
                    stroke="#000000"
                    d="M4 4.5h7m1 0h2m1 0h1m1 0h2m3 0h7M4 5.5h1m5 0h1m1 0h3m2 0h1m4 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h3m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m2 0h1m1 0h3m2 0h1m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m3 0h2m1 0h2m3 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M15 11.5h1m1 0h2m1 0h1M4 12.5h1m2 0h8m3 0h1m1 0h2m2 0h1m1 0h3M4 13.5h1m1 0h1m1 0h1m3 0h1m1 0h1m2 0h4m2 0h5M5 14.5h2m1 0h1m1 0h3m1 0h2m2 0h2m1 0h1m2 0h2m2 0h1M4 15.5h3m1 0h2m2 0h1m1 0h1m3 0h1m3 0h2m1 0h4M6 16.5h1m3 0h1m1 0h2m1 0h2m1 0h2m2 0h1m5 0h1M4 17.5h1m1 0h3m3 0h2m4 0h3m3 0h1m2 0h1M4 18.5h2m1 0h1m2 0h1m3 0h3m1 0h2m1 0h2m1 0h5M4 19.5h1m4 0h1m3 0h3m2 0h1m1 0h1m1 0h2m1 0h2m1 0h1M4 20.5h1m5 0h4m2 0h2m2 0h5m1 0h2M12 21.5h2m1 0h2m3 0h1m3 0h1m1 0h2M4 22.5h7m1 0h4m2 0h1m1 0h1m1 0h1m1 0h1m3 0h1M4 23.5h1m5 0h1m1 0h1m2 0h1m1 0h1m1 0h2m3 0h1m2 0h2M4 24.5h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h7M4 25.5h1m1 0h3m1 0h1m1 0h1m2 0h4m2 0h2m4 0h2M4 26.5h1m1 0h3m1 0h1m2 0h3m1 0h1m1 0h1m1 0h1m2 0h5M4 27.5h1m5 0h1m4 0h1m2 0h1m3 0h3m1 0h3M4 28.5h7m1 0h1m1 0h1m1 0h1m3 0h1m1 0h1m2 0h1m2 0h1"
                  />
                </svg> */}
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
