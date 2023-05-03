import Image from 'next/image';
import React, {useEffect} from 'react';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {IAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {TypeOfBorderColor, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import QRCode from 'qrcode';
import useStateRef from 'react-usestateref';
import {getChainNameByCurrency, toDisplayCFDOrder} from '../../lib/common';
import {ICFDOrder} from '../../interfaces/tidebit_defi_background/order';
import {ProfitState} from '../../constants/profit_state';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useTranslation} from 'react-i18next';
import {TypeOfPosition} from '../../constants/type_of_position';
import {DOMAIN, TRADING_CRYPTO_DATA} from '../../constants/config';
import {ICurrency} from '../../constants/currency';
import {useGlobal} from '../../contexts/global_context';

/**
 *    TODO:  (20230502 - Shirley)
 * PNL = (1 / entryPrice - 1 / exitPrice) * amount 百分比
 * CFD order 的 owner
 */
interface IRecordSharingBoxProps {
  order: IDisplayCFDOrder;
  qrcodeUrl?: string;
  boxVisible: boolean;
  boxRef?: React.RefObject<HTMLDivElement>;
  boxClickHandler: () => void;
  innerRef?: React.RefObject<HTMLDivElement>;
}

const RecordSharingBox = ({
  innerRef,
  order,
  qrcodeUrl,
  boxVisible = true,
  boxRef,
  boxClickHandler: modalClickHandler,
  ...otherProps
}: IRecordSharingBoxProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const globalCtx = useGlobal();

  const url = qrcodeUrl ? qrcodeUrl : DOMAIN;
  const [qrcode, setQrcode, qrcodeRef] = useStateRef<string>('');

  let displayedChain = '';

  try {
    displayedChain = getChainNameByCurrency(order.ticker as ICurrency, TRADING_CRYPTO_DATA);
  } catch (e) {
    // TODO: Error handling (20230503 - Shirley)
    // eslint-disable-next-line no-console
    console.error(e);
  }

  const generateQRCode = async (text: string) => {
    try {
      const qr = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        margin: 3,
        rendererOpts: {
          quality: 1,
        },
      });

      setQrcode(qr);
    } catch (err) {
      // TODO: handle error (20230503 - Shirley)
      // eslint-disable-next-line no-console
      console.error(`Generate qr code, ${err}`);
    }
  };

  useEffect(() => {
    generateQRCode(url);
    // console.log('cfd in box', order);
  }, []);

  const displayedTypeOfPosition =
    order.typeOfPosition === TypeOfPosition.BUY
      ? `${t('SHARING_BOX.TYPE_UP')} ${t('SHARING_BOX.TYPE_BUY')}`
      : `${t('SHARING_BOX.TYPE_DOWN')} ${t('SHARING_BOX.TYPE_SELL')}`;

  const displayedBorderColor =
    order.pnl.type === ProfitState.PROFIT ? TypeOfBorderColor.PROFIT : TypeOfBorderColor.LOSS;
  const displayedTextColor =
    order.pnl.type === ProfitState.PROFIT
      ? 'text-lightGreen5'
      : order.pnl.type === ProfitState.LOSS
      ? 'text-lightRed3'
      : '';

  const displayedPnLSymbol =
    order.pnl.type === ProfitState.PROFIT ? '⬆' : order.pnl.type === ProfitState.LOSS ? '⬇' : '';

  const isDisplayedModal = boxVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div ref={boxRef}>
          <div
            ref={innerRef}
            style={{
              backgroundImage: `url('/elements/group_15214@2x.png')`,
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
                  <Image
                    src={`/asset_icon/${order.targetAsset.toLocaleLowerCase()}.svg`}
                    width={45}
                    height={45}
                    alt="asset icon"
                  />
                  <h1 className="text-4xl font-normal">{displayedChain}</h1>
                </div>
                <p className="mt-2 rounded-sm bg-white/80 px-1 text-sm font-bold text-black">
                  {displayedTypeOfPosition}
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
                      {displayedPnLSymbol} {order.pnl?.percent} %
                    </div>
                    {/* Info: CFD info (20230502 - Shirley) */}
                    <div className="flex-col space-y-2">
                      <div className="mx-5 flex justify-between text-base text-lightGray">
                        <div className="">{t('SHARING_BOX.OPEN_PRICE')}</div>
                        <div className="flex items-end space-x-2 text-white">
                          <p>
                            {order.openPrice.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <span className="text-xs text-lightGray">USDT</span>
                        </div>
                      </div>
                      <div className="mx-5 flex justify-between text-base text-lightGray">
                        <div className="">{t('SHARING_BOX.CLOSED_PRICE')}</div>
                        <div className="flex items-end space-x-2 text-white">
                          <p>
                            {order?.closePrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) ?? 0}
                          </p>
                          <span className="text-xs text-lightGray">USDT</span>
                        </div>
                      </div>
                      <div className="mx-5 flex justify-between text-base text-lightGray">
                        <div className="">{t('SHARING_BOX.LEVERAGE')}</div>
                        <div className="flex text-white">{order.leverage}x</div>
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
                  </>
                )}
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
