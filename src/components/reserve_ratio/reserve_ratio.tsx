import React, {useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import Image from 'next/image';
import {FaLink} from 'react-icons/fa';
import {BiLinkAlt} from 'react-icons/bi';
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

  const displayedTidebitUserHolding = SafeMath.isNumber(websiteReserve.usersHolding)
    ? websiteReserve.usersHolding.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : websiteReserve.usersHolding;
  const displayedTidebitReserve = SafeMath.isNumber(websiteReserve.tidebitReserve)
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
        <Link
          className="flex w-full items-center justify-center space-x-2 transition-all duration-150 hover:text-tidebitTheme lg:justify-end lg:pr-24"
          href={`/`}
        >
          <p className="text-sm">Download Report</p>
          <FiDownload size={20} />
        </Link>

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
              userHoldings={displayedTidebitUserHolding}
              walletAssets={displayedTidebitReserve}
            />
            <ReserveCard
              name="ETH"
              color="text-bluePurple"
              percentage="150"
              icon="/asset_icon/eth.svg"
              link="/"
              userHoldings={displayedTidebitUserHolding}
              walletAssets={displayedTidebitReserve}
            />
            <ReserveCard
              name="BTC"
              color="text-lightOrange"
              percentage="150"
              icon="/asset_icon/btc.svg"
              link="/"
              userHoldings={displayedTidebitUserHolding}
              walletAssets={displayedTidebitReserve}
            />
          </div>
        </div>

        <div
          className="mt-10 flex lg:hidden"
          style={{
            backgroundImage: `url(/elements/group_15244.svg)`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={mobileCardLayout}>
            <ReserveCard
              name="USDT"
              color="text-lightGreen2"
              percentage="150"
              icon="/asset_icon/usdt.svg"
              link="/"
              userHoldings={displayedTidebitUserHolding}
              walletAssets={displayedTidebitReserve}
            />
          </div>
        </div>
        <div
          className="flex lg:hidden"
          style={{
            backgroundImage: `url(/elements/group_15244.svg)`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={mobileCardLayout}>
            <ReserveCard
              name="ETH"
              color="text-bluePurple"
              percentage="150"
              icon="/asset_icon/eth.svg"
              link="/"
              userHoldings={displayedTidebitUserHolding}
              walletAssets={displayedTidebitReserve}
            />{' '}
          </div>
        </div>
        <div
          className="flex lg:hidden"
          style={{
            backgroundImage: `url(/elements/group_15244.svg)`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={mobileCardLayout}>
            <ReserveCard
              name="BTC"
              color="text-lightOrange"
              percentage="150"
              icon="/asset_icon/btc.svg"
              link="/"
              userHoldings={displayedTidebitUserHolding}
              walletAssets={displayedTidebitReserve}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ReserveRatio;
