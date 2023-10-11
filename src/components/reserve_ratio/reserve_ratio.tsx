import React, {useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import SafeMath from '../../lib/safe_math';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {BAIFA_LINK, FRACTION_DIGITS} from '../../constants/config';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import Link from 'next/link';
import ReserveCard from '../reserve_card/reserve_card';
import {FiDownload} from 'react-icons/fi';
import {useGlobal} from '../../contexts/global_context';
import {ToastTypeAndText} from '../../constants/toast_type';
import {numberFormatted} from '../../lib/common';
import useCheckLink from '../../lib/hooks/use_check_link';

const ReserveRatio = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {websiteReserve} = useContext(MarketContext);
  const {BTC, ETH, USDT} = websiteReserve;

  const baifaLink = useCheckLink(BAIFA_LINK, BAIFA_LINK);
  const baifaProjectId = process.env.BAIFA_PROJECT_ID;

  // TODO: 用 isNumber 檢驗，資料傳給卡片之前都整理成 string (20230914 - Shirley)
  const usdtReserveRatio = numberFormatted(USDT.reserveRatio);
  const usdtUserHolding = numberFormatted(USDT.usersHolding);
  const usdtReserve = numberFormatted(USDT.tidebitReserve);

  const ethReserveRatio = numberFormatted(ETH.reserveRatio);
  const ethUserHolding = numberFormatted(ETH.usersHolding);
  const ethReserve = numberFormatted(ETH.tidebitReserve);

  const btcReserveRatio = numberFormatted(BTC.reserveRatio);
  const btcUserHolding = numberFormatted(BTC.usersHolding);
  const btcReserve = numberFormatted(BTC.tidebitReserve);

  const mobileCardLayout =
    'mx-auto flex w-full flex-col items-center justify-center bg-center pb-0 lg:flex-row';

  return (
    <>
      <section className="text-white">
        <div className="mb-10 items-center font-medium text-white text-2xl xs:text-3xl sm:text-4xl">
          <div className="flex items-center justify-center">
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
            <h1 className="mx-0 sm:mx-1 w-220px xs:w-340px md:w-auto text-center">
              {t('HOME_PAGE.RESERVE_RATIO_BLOCK_TITLE')}
              <span className="text-tidebitTheme">
                {' '}
                {t('HOME_PAGE.RESERVE_RATIO_BLOCK_TITLE_HIGHLIGHT')}
              </span>{' '}
              {t('HOME_PAGE.RESERVE_RATIO_BLOCK_TITLE_2')}
            </h1>
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
          </div>
        </div>
        <div className="flex w-full justify-center lg:justify-end pr-0 transition-all duration-150 lg:pr-1/8 2xl:pr-1/5">
          <a
            // TODO: Report updated from context (20230619 - Shirley)
            href={`${BAIFA_LINK}/reports/${baifaProjectId}/${t('HOME_PAGE.REPORTS_LINK')}`}
            download
            target="_blank"
            className="flex space-x-2 hover:text-tidebitTheme"
          >
            <p className="text-sm">{t('HOME_PAGE.DOWNLOAD_REPORT')}</p>
            <FiDownload size={20} />
          </a>
        </div>

        {/* Info: desktop (20230620 - Shirley) */}
        <div
          className="mt-28 hidden lg:flex"
          style={{
            backgroundImage: `url(/elements/group_15244.svg)`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="mx-auto flex w-full flex-col items-center justify-center bg-center pb-20 lg:flex-row">
            <ReserveCard
              name="USDT"
              color="text-lightGreen2"
              ratio={usdtReserveRatio}
              icon="/asset_icon/usdt.svg"
              link={`${baifaLink}/reports/${baifaProjectId}/plugin`}
              userHoldings={usdtUserHolding}
              walletAssets={usdtReserve}
            />
            <ReserveCard
              name="ETH"
              color="text-bluePurple"
              ratio={ethReserveRatio}
              icon="/asset_icon/eth.svg"
              link={`${baifaLink}/reports/${baifaProjectId}/plugin`}
              userHoldings={ethUserHolding}
              walletAssets={ethReserve}
            />
            <ReserveCard
              name="BTC"
              color="text-lightOrange"
              ratio={btcReserveRatio}
              icon="/asset_icon/btc.svg"
              link={`${baifaLink}/reports/${baifaProjectId}/plugin`}
              userHoldings={btcUserHolding}
              walletAssets={btcReserve}
            />
          </div>
        </div>

        {/* Info: mobile (20230620 - Shirley) */}
        <div className="mt-10 flex lg:hidden">
          <div className={mobileCardLayout}>
            <ReserveCard
              name="USDT"
              color="text-lightGreen2"
              ratio={usdtReserveRatio}
              icon="/asset_icon/usdt.svg"
              link={`${baifaLink}/reports/${baifaProjectId}/plugin`}
              userHoldings={usdtUserHolding}
              walletAssets={usdtReserve}
            />
            <ReserveCard
              name="ETH"
              color="text-bluePurple"
              ratio={ethReserveRatio}
              icon="/asset_icon/eth.svg"
              link={`${baifaLink}/reports/${baifaProjectId}/plugin`}
              userHoldings={ethUserHolding}
              walletAssets={ethReserve}
            />
            <ReserveCard
              name="BTC"
              color="text-lightOrange"
              ratio={btcReserveRatio}
              icon="/asset_icon/btc.svg"
              link={`${baifaLink}/reports/${baifaProjectId}/plugin`}
              userHoldings={btcUserHolding}
              walletAssets={btcReserve}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ReserveRatio;
