import React from 'react';
import Image from 'next/image';
import {BiLinkAlt} from 'react-icons/bi';
import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import {getI18nLink} from '../../lib/common';

type TranslateFunction = (s: string) => string;
interface ICryptoSummary {
  icon: string;
  label: string;
  introduction: string;
  whitePaperLink: string;
  websiteLink: string;

  price: string;
  rank: number;
  publishTime: string;
  publishAmount: string;
  tradingVolume: string;
  totalValue: string;
  tradingValue: string;
}

const CryptoSummary = ({
  icon,
  label,
  introduction,
  whitePaperLink,
  websiteLink,
  price,
  rank,
  publishTime,
  publishAmount,
  tradingVolume,
  totalValue,
  tradingValue,
}: ICryptoSummary) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {i18n} = useTranslation('common');
  const language = i18n.language;

  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';

  // Info: (20230925 - Julian) i18n URL workaround
  const whitePaperLinkWithI18n = getI18nLink(whitePaperLink, language ?? '') ?? whitePaperLink;
  const websiteLinkWithI18n = getI18nLink(websiteLink, language ?? '') ?? websiteLink;

  return (
    <>
      <div className="flex-col justify-start">
        {' '}
        <h1 className="pr-12 text-start text-xl text-lightWhite">
          {t('TRADE_PAGE.CRYPTO_SUMMARY_WHITEPAPER_TITLE')}
        </h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
        <div className={`${overallWidth}`}>
          <section className="">
            <div className="mx-auto flex flex-wrap pb-5">
              {/* Left side */}
              <div className="mb-0 border-b border-white/30 pb-10 lg:mb-0 lg:w-1/2 lg:border-b-0 lg:border-r-2 lg:py-0 lg:pr-12">
                {/* Icon and name */}
                <div className="flex items-center space-x-3 text-center">
                  <span className="relative h-40px w-40px">
                    <Image src={icon} alt={label} width={40} height={40} />
                  </span>
                  <h1 className="text-lg font-medium text-white">{label}</h1>
                </div>

                <p className="pt-2 text-sm leading-relaxed text-lightGray5">{introduction}</p>

                {/* Links */}
                <div className="mt-5 flex space-x-2">
                  <Link
                    href={whitePaperLinkWithI18n}
                    target="_blank"
                    className={`flex flex-row items-center space-x-2 rounded-full bg-lightGray3 px-3 py-1 text-sm font-bold  text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
                  >
                    <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_WHITEPAPER')}</p>
                    <BiLinkAlt size={20} />
                  </Link>

                  <Link
                    href={websiteLinkWithI18n}
                    target="_blank"
                    className={`flex flex-row items-center space-x-2 rounded-full bg-lightGray3 px-3 py-1 text-sm font-bold  text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
                  >
                    <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_WEBSITE')}</p>
                    <BiLinkAlt size={20} />
                  </Link>
                </div>
              </div>

              {/* Right side */}
              <div className="mt-4 flex w-full flex-col justify-start lg:w-1/2 lg:pl-12">
                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_PRICE')}</p>
                  <p>{price}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_RANK')}</p>
                  <p>{rank}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_PUBLISH_TIME')}</p>
                  <p>{publishTime}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_PUBLISH_AMOUNT')}</p>
                  <p>{publishAmount}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_TRADING_VOLUME')}</p>
                  <p>{tradingVolume}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_TOTAL_VALUE')}</p>
                  <p>{totalValue}</p>
                </div>

                <div className="flex justify-between pb-5 text-sm text-lightGray5 lg:pr-10">
                  <p>{t('TRADE_PAGE.CRYPTO_SUMMARY_TRADING_VALUE')}</p>
                  <p>{tradingValue}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CryptoSummary;
