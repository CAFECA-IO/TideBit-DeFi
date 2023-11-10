import Image from 'next/image';
import {BiLinkAlt} from 'react-icons/bi';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useTranslation} from 'next-i18next';
import {BAIFA_LINK} from '../../constants/config';
import useCheckLink from '../../lib/hooks/use_check_link';
import {getTimestamp, timestampToString} from '../../lib/common';
import {ONE_DAY_IN_SECONDS} from '../../constants/display';
import React from 'react';

const yesterday = getTimestamp() - ONE_DAY_IN_SECONDS;
const reportDate = timestampToString(yesterday);

const AuditReport = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const baifaLink = useCheckLink(BAIFA_LINK, BAIFA_LINK);

  return (
    <section>
      <div className="mb-5 items-center font-medium text-white lg:mb-10 text-2xl xs:text-3xl sm:text-4xl">
        <div className="flex items-center justify-center">
          <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-3/10 xl:mx-2"></span>
          <h1 className="mx-3 text-center">
            <span className="text-tidebitTheme">{t('HOME_PAGE.SMART')}</span>
            {t('HOME_PAGE.AUDITING_REPORTS')}
          </h1>
          <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-3/10 xl:mx-2"></span>
        </div>
      </div>

      <div className="lg:mx-20">
        <div className="mb-5 flex w-full justify-center text-lightGray lg:mb-10">
          {t('HOME_PAGE.LAST_UPDATED')}{' '}
          <span className="text-lightWhite">
            &nbsp;{reportDate.monthName} {reportDate.day}, {reportDate.year}
          </span>
        </div>

        <div className="mb-5 flex w-full justify-center lg:-mt-20 lg:mb-20 lg:justify-end xl:pr-1/10">
          <Image src={`/certificate/3-v@2x.png`} alt="certificate" width={60} height={60} />
        </div>

        <div className="flex w-full justify-around">
          <div className="mx-0 grid grid-cols-2 items-center justify-center gap-x-5 gap-y-5 lg:mx-0 lg:flex lg:w-full lg:flex-row lg:items-center lg:justify-center lg:space-x-12 lg:space-y-0">
            <div className="flex h-130px w-130px sm:h-150px sm:w-150px items-center justify-center rounded-xl border-1px border-transparent bg-darkGray4 transition-all duration-150 hover:cursor-pointer hover:border-tidebitTheme xs:h-130px xs:w-130px lg:h-200px lg:w-200px">
              <a
                // TODO: Report updated from context (20230619 - Shirley)
                href={`${t('HOME_PAGE.COMPREHENSIVE_INCOME_STATEMENT_LINK')}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center space-y-5"
              >
                <Image
                  className="mx-5 h-40px w-40px xs:h-50px xs:w-50px lg:h-80px lg:w-80px"
                  src={`/elements/group_15865.svg`}
                  width={80}
                  height={80}
                  alt="Income Statement"
                />
                <p className=" text-center text-xs sm:text-base lg:text-lg">
                  {t('HOME_PAGE.COMPREHENSIVE_INCOME_STATEMENT')}
                </p>
              </a>
            </div>

            <div className="flex h-130px w-130px sm:h-150px sm:w-150px items-center justify-center rounded-xl border-1px border-transparent bg-darkGray4 transition-all duration-150 hover:cursor-pointer hover:border-tidebitTheme xs:h-130px xs:w-130px lg:h-200px lg:w-200px">
              <a
                // TODO: Report updated from context (20230619 - Shirley)
                href={`${t('HOME_PAGE.BALANCE_SHEET_LINK')}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center space-y-5"
              >
                <Image
                  className="mx-5 h-40px w-40px xs:h-50px xs:w-50px lg:h-80px lg:w-80px"
                  src={`/elements/group_15867.svg`}
                  width={80}
                  height={80}
                  alt="Balance Sheet"
                />
                <p className="text-xs sm:text-base lg:text-lg">{t('HOME_PAGE.BALANCE_SHEET')}</p>
              </a>
            </div>

            <div className="flex h-130px w-130px sm:h-150px sm:w-150px items-center justify-center rounded-xl border-1px border-transparent bg-darkGray4 transition-all duration-150 hover:cursor-pointer hover:border-tidebitTheme xs:h-130px xs:w-130px lg:h-200px lg:w-200px">
              <a
                // TODO: Report updated from context (20230619 - Shirley)
                href={`${t('HOME_PAGE.CASH_FLOW_STATEMENT_LINK')}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center space-y-5"
              >
                <Image
                  className="mx-5 h-40px w-40px xs:h-50px xs:w-50px lg:h-80px lg:w-80px"
                  src={`/elements/group_15869.svg`}
                  width={80}
                  height={80}
                  alt="Cash Flow Statement"
                />
                <div className="flex flex-col items-center justify-center w-full">
                  <p className="text-xs xs:text-xs sm:text-base lg:text-lg text-center">
                    {t('HOME_PAGE.CASH_FLOW_STATEMENT')}
                  </p>
                </div>
              </a>
            </div>

            <div className="flex h-130px w-130px sm:h-150px sm:w-150px items-center  justify-center rounded-xl border-1px border-transparent bg-darkGray4 transition-all duration-150 hover:cursor-pointer hover:border-tidebitTheme xs:h-130px xs:w-130px lg:h-200px lg:w-200px">
              <a
                // TODO: Report updated from context (20230619 - Shirley)
                href={t('HOME_PAGE.RED_FLAG_ANALYSIS_LINK')}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center space-y-5"
              >
                <Image
                  className="mx-5 h-40px w-40px xs:h-50px xs:w-50px lg:h-80px lg:w-80px"
                  src={`/elements/group_15870.svg`}
                  width={80}
                  height={80}
                  alt="Red Flag Analysis"
                />
                <p className="text-xs sm:text-base lg:text-lg">
                  {t('HOME_PAGE.RED_FLAG_ANALYSIS')}
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center space-x-3 pt-10 lg:flex-row flex-col items-center lg:space-y-0 space-y-2">
          <p className=""> {t('HOME_PAGE.POWERED_BY')}</p>
          <a
            href={baifaLink}
            target="_blank"
            rel="noreferrer"
            className={`flex w-105px items-center justify-center space-x-2 whitespace-nowrap rounded-full bg-lightGray3 px-3 py-1 text-sm font-bold text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black`}
          >
            <p className="">BAIFA</p>

            <BiLinkAlt size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AuditReport;
