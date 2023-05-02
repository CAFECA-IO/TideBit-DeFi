import Image from 'next/image';
import React from 'react';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';

interface IRecordSharingBoxProps {
  // ticker: string;
  // user: string;
  // cfd: IAcceptedCFDOrder;
  boxVisible: boolean;
  boxRef: React.RefObject<HTMLDivElement>;
  boxClickHandler: () => void;
}

const RecordSharingBox = ({
  // ticker,
  // user,
  // cfd,
  boxVisible = true,
  boxRef,
  boxClickHandler: modalClickHandler,
}: IRecordSharingBoxProps) => {
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
            {/* <Image
              className="h-full w-full object-cover"
              src="/elements/group_15214.png"
              width={600}
              height={736}
              alt="pnl bg"
            /> */}
            <div className="ml-10 mt-20">
              <div className="flex">
                <Image src="/asset_icon/eth.svg" width={45} height={45} alt="asset icon" />
                <div>Ethereum</div>
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
