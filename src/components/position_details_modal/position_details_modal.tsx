import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {BORDER_COLOR_TYPE, PNL_COLOR_TYPE} from '../../constants/display';

interface IPositionDetailsModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  // ticker: string;
  // date: string;
  // time: string;
  // typeOfPosition: string;
  // entryPrice: string;
  // exitPrice: string;
  openCfdDetails?: IOpenCFDDetails;
}

const PositionDetailsModal = ({
  // openCfdDetails,
  modalVisible,
  modalClickHandler,
}: IPositionDetailsModal) => {
  const dataFormat = {
    type: 'UP (Buy)',
    amount: '0.1',
    PNL: '34.9',
    openValue: '656.9',
    openPrice: '131.8',
    openTime: '2022-05-30 13:04:57', // date + time
    takeProfit: '-',
    stopLoss: '-',
    liquidationPrice: '1183.6',
    state: 'Open',
  };

  const displayedDataFormat = () => {
    const elements = [];
    for (const [key, value] of Object.entries(dataFormat)) {
      elements.push(
        <div className="mx-6 my-5 flex justify-between">
          <div className="text-lightGray">{key}</div>
          <div className="">{value}</div>
        </div>
      );
    }
    return elements;
  };

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div className="relative flex h-726px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="ml-10 mr-8 mt-6 flex w-450px justify-between">
                <div className="flex items-center space-x-3 text-center text-4xl text-lightWhite">
                  <Image src="/elements/group_2371.svg" width={40} height={40} alt="icon" />
                  <h3 className="">ETH </h3>
                </div>

                <div className="text-end text-base text-lightGray">
                  <p className="">2022-05-30</p>
                  <p className="">13:04:57</p>
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto pt-1">
              <div
                className={`${BORDER_COLOR_TYPE.profit} mx-10 mt-5 border-1px text-base leading-relaxed text-lightWhite`}
              >
                <div className="flex-col justify-center text-center">
                  {/* {displayedDataFormat()} */}

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Type</div>
                    {/* <div className="">{openCfdDetails.typeOfPosition}</div> */}
                    <div className="">Up (Buy)</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Amount</div>
                    <div className="">0.1</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">PNL</div>
                    <div className={`${PNL_COLOR_TYPE.profit}`}>$ +34.9</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Open Value</div>
                    <div className="">$ 656.9</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Open Price</div>
                    <div className="">$ 131.8</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Open Time</div>
                    <div className="">2022-05-30 13:04:57</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Limit/ Stop</div>
                    <div className="">- / -</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">Liquidation Price</div>
                    <div className="">$ 1182.5</div>
                  </div>

                  <div className="mx-6 my-5 flex justify-between">
                    <div className="text-lightGray">State</div>
                    <div className="">
                      Open{' '}
                      <button
                        type="button"
                        className="ml-2 text-tidebitTheme underline underline-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default PositionDetailsModal;
