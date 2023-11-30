import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import TideLink from '../tide_link/tide_link';
import RippleButton from '../ripple_button/ripple_button';
import {useTranslation} from 'next-i18next';
import {TBDURL} from '../../constants/api_request';
import {COPYRIGHT} from '../../constants/config';
import {useRouter} from 'next/router';
import {isValidTradeURL} from '../../lib/common';

type TranslateFunction = (s: string) => string;

const Footer = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();

  const tradeLink = isValidTradeURL(router.asPath) ? router.asPath : TBDURL.TRADE;

  const ICON_SIZE = 30;
  const socialMediaLinks = [
    {
      label: 'Facebook',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image src={'/elements/facebook.svg'} alt="Facebook" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
    {
      label: 'Instagram',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image
          src={'/elements/instagram.svg'}
          alt="instagram"
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      ),
    },
    {
      label: 'Twitter',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image src={'/elements/twitter.svg'} alt="twitter" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
    {
      label: 'Reddit',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image src={'/elements/reddit.svg'} alt="reddit" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
  ];

  const servicesLinks = [
    {label: t('FOOTER.TRADE'), path: tradeLink},
    {label: t('NAV_BAR.TIDEBIT_UNIVERSITY'), path: TBDURL.COMING_SOON},
    {label: t('NAV_BAR.HELP_CENTER'), path: TBDURL.COMING_SOON},
  ];

  const tideBitLinks = [{label: t('FOOTER.HIRING'), path: TBDURL.COMING_SOON}];

  const policyLinks = [
    {label: t('FOOTER.SERVICE_POLICY'), path: TBDURL.COMING_SOON},
    {label: t('FOOTER.PRIVACY_POLICY'), path: TBDURL.COMING_SOON},
  ];

  const socialMediaLinksList = socialMediaLinks.map(({label, path, icon}) => (
    <TideLink
      key={label}
      href={path}
      content={icon}
      className="mx-10px flex shrink-0 justify-center text-gray-400 hover:text-cyan-300"
      target="_blank"
      htmlref="noopener noreferrer"
    />
  ));

  const servicesLinksList = servicesLinks.map(({label, path}) => (
    <li key={label} className="mt-2 text-base">
      <TideLink href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const tideBitLinksList = tideBitLinks.map(({label, path}) => (
    <li key={label} className="mt-2 text-base">
      <TideLink href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const policyLinksList = policyLinks.map(({label, path}) => (
    <li key={label} className="mt-2 text-base">
      <TideLink href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const desktopVersionBreakpoint = 'hidden lg:flex';
  const mobileVersionBreakpoint = 'flex lg:hidden';

  return (
    <>
      {/* Info: (20230328 - Julian) Desktop */}
      <div className={`${desktopVersionBreakpoint}`}>
        <footer className="mx-auto w-screen bg-darkGray text-base lg:justify-center container">
          <div className="mx-auto max-w-1920px flex flex-col justify-between flex-wrap pb-10 pt-24 md:flex-row md:flex-nowrap md:items-center lg:items-start">
            <div className="flex grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left justify-around">
              <div className="mx-auto shrink-0 text-center md:mx-0">
                <Link
                  href="/#"
                  className="flex flex-col items-center justify-center font-medium text-white md:justify-start"
                >
                  <Image src="/elements/footer_logo.svg" width={120} height={100} alt="TideBit" />
                </Link>
                <span className="mt-3 flex h-px w-full justify-center rounded bg-white xl:w-full"></span>

                <div className="container mx-auto inline-flex justify-center pt-3 sm:mt-0">
                  {socialMediaLinksList}
                </div>
              </div>

              <div className="">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.SERVICES')}
                </h2>
                <nav className="mb-5 list-none">{servicesLinksList}</nav>
              </div>
              <div className="">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.TIDEBIT')}
                </h2>
                <nav className="mb-5 list-none">{tideBitLinksList}</nav>
              </div>
              <div className="">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.POLICY_CONDITIONS')}
                </h2>
                <nav className="mb-5 list-none">{policyLinksList}</nav>
              </div>

              <div className="">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.NEWSLETTER')}
                </h2>

                <div className="flex flex-wrap items-end justify-center space-y-2 md:justify-start max-w-300px">
                  <div className="relative mr-2 sm:mr-4 sm:w-auto lg:mr-4">
                    <input
                      placeholder={t('FOOTER.EMAIL_PLACEHOLDER')}
                      type="text"
                      id="FooterEmailDesktop"
                      name="email"
                      className="block min-w-220px rounded border border-white bg-darkGray px-3 py-1 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray xl:w-220px"
                    />
                  </div>
                  <RippleButton
                    id="FooterSubscribeButton"
                    buttonType="button"
                    className={`mt-4 rounded border-0 bg-tidebitTheme px-5 py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                  >
                    {t('FOOTER.SUBSCRIBE_BUTTON')}
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-1920px">
            <div className="flex flex-col flex-wrap pb-4 pt-1 sm:flex-row sm:justify-center md:justify-end">
              <p className="text-center text-xs text-gray-400 sm:text-left md:mt-5 lg:mr-36 lg:mt-0">
                {COPYRIGHT}
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Info: (20230328 - Julian) Mobile */}
      <div className={`${mobileVersionBreakpoint} w-full`}>
        <footer className="mx-0 lg:mx-auto w-full justify-center bg-darkGray text-base">
          <div className="flex flex-col flex-wrap px-1/10 pb-10 pt-10 md:flex-row md:flex-nowrap md:items-center lg:items-start">
            {/* Info: (20230328 - Julian) LOGO & Social media */}
            <div className="mx-auto w-full shrink-0 text-center">
              <Link
                href="/#"
                className="flex flex-col items-center justify-center font-medium text-white md:justify-start"
              >
                <Image src="/elements/footer_logo.svg" width={96} height={80} alt="TideBit" />
              </Link>
              <span className="container mx-auto mt-3 flex h-px w-200px justify-center rounded bg-lightGray"></span>

              <div className="container mx-auto inline-flex justify-center pt-3">
                {socialMediaLinksList}
              </div>

              {/* Info: (20230328 - Julian) Links & Newsletter */}
              <div className="flex grow flex-col flex-wrap text-center">
                <div className="my-5 w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                    {t('FOOTER.SERVICES')}
                  </h2>
                  <nav className="mb-5 list-none">{servicesLinksList}</nav>
                </div>
                <div className="my-5 w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                    {t('FOOTER.TIDEBIT')}
                  </h2>
                  <nav className="mb-5 list-none">{tideBitLinksList}</nav>
                </div>
                <div className="my-5 w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                    {t('FOOTER.POLICY_CONDITIONS')}
                  </h2>
                  <nav className="mb-5 list-none">{policyLinksList}</nav>
                </div>
                <div className="my-5 w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                    {t('FOOTER.NEWSLETTER')}
                  </h2>

                  <div className="flex flex-col flex-wrap items-center justify-center">
                    <div className="relative w-220px md:mb-5">
                      <input
                        placeholder={t('FOOTER.EMAIL_PLACEHOLDER')}
                        type="text"
                        id="FooterEmailMobile"
                        name="email"
                        className="block w-full rounded border border-white bg-darkGray px-3 py-1 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray"
                      />
                    </div>
                    <RippleButton
                      id="FooterSubscribeButton"
                      buttonType="button"
                      className={`mt-4 rounded border-0 bg-tidebitTheme px-5 py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                    >
                      {t('FOOTER.SUBSCRIBE_BUTTON')}
                    </RippleButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 pb-0">
            <div className="flex flex-col flex-wrap px-5 pb-8 pt-1 sm:flex-row sm:justify-center md:justify-end">
              <p className="text-center text-xs text-gray-400 sm:text-left md:mt-5 lg:mr-36 lg:mt-0">
                {COPYRIGHT}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
