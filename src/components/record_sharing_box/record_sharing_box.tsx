import Image from 'next/image';
import React from 'react';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {TypeOfBorderColor} from '../../constants/display';

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
                <Image
                  className=""
                  alt="QR Code"
                  src="/elements/tidebit_qrcode.png"
                  width={100}
                  height={100}
                />
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
