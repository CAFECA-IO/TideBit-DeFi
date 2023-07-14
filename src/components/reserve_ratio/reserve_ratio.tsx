import React, {useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import SafeMath from '../../lib/safe_math';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {FRACTION_DIGITS} from '../../constants/config';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import Link from 'next/link';
import ReserveCard from '../reserve_card/reserve_card';
import {FiDownload} from 'react-icons/fi';

const ReserveRatio = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {websiteReserve} = useContext(MarketContext);

  const usdtUserHolding = SafeMath.isNumber(websiteReserve.usersHolding)
    ? websiteReserve.usersHolding.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.usersHolding;
  const usdtReserve = SafeMath.isNumber(websiteReserve.tidebitReserve)
    ? websiteReserve.tidebitReserve.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.tidebitReserve;

  // TODO: ETH reserve ratio from context (20230619 - Shirley)
  const ethUserHolding = SafeMath.isNumber(websiteReserve.usersHolding)
    ? websiteReserve.usersHolding.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.usersHolding;
  const ethReserve = SafeMath.isNumber(websiteReserve.tidebitReserve)
    ? websiteReserve.tidebitReserve.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.tidebitReserve;

  // TODO: BTC reserve ratio from context (20230619 - Shirley)
  const btcUserHolding = SafeMath.isNumber(websiteReserve.usersHolding)
    ? websiteReserve.usersHolding.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.usersHolding;
  const btcReserve = SafeMath.isNumber(websiteReserve.tidebitReserve)
    ? websiteReserve.tidebitReserve.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.tidebitReserve;

  const mobileCardLayout =
    'mx-auto flex w-full flex-col items-center justify-center bg-center pb-40 lg:flex-row';

  return (
    <>
      <section className="text-white">
        <div className="mb-10 items-center text-2xl font-medium text-white lg:text-3xl xl:text-4xl">
          <div className="flex items-center justify-center">
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2"></span>
            <h1 className="mx-1 text-center">
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
        <div className="flex w-full justify-end pr-1/6 transition-all duration-150 lg:pr-1/8 2xl:pr-1/5">
          <Link
            // TODO: Report updated from context (20230619 - Shirley)
            href={t('HOME_PAGE.REPORTS_LINK')}
            download
            target="_blank"
            className="flex space-x-2 hover:text-tidebitTheme"
          >
            <p className="text-sm">{t('HOME_PAGE.DOWNLOAD_REPORT')}</p>
            <FiDownload size={20} />
          </Link>
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
              percentage="150"
              icon="/asset_icon/usdt.svg"
              link="/"
              userHoldings={usdtUserHolding}
              walletAssets={usdtReserve}
            />
            <ReserveCard
              name="ETH"
              color="text-bluePurple"
              percentage="150"
              icon="/asset_icon/eth.svg"
              link="/"
              userHoldings={ethUserHolding}
              walletAssets={ethReserve}
            />
            <ReserveCard
              name="BTC"
              color="text-lightOrange"
              percentage="150"
              icon="/asset_icon/btc.svg"
              link="/"
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
              percentage="150"
              icon="/asset_icon/usdt.svg"
              link="/"
              userHoldings={usdtUserHolding}
              walletAssets={usdtReserve}
            />

            <ReserveCard
              name="ETH"
              color="text-bluePurple"
              percentage="150"
              icon="/asset_icon/eth.svg"
              link="/"
              userHoldings={ethUserHolding}
              walletAssets={ethReserve}
            />

            <ReserveCard
              name="BTC"
              color="text-lightOrange"
              percentage="150"
              icon="/asset_icon/btc.svg"
              link="/"
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
