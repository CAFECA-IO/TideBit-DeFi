import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import TideLink from '../tide_link/tide_link';
import RippleButton from '../ripple_button/ripple_button';
import {useTranslation} from 'react-i18next';
import {TBDURL} from '../../constants/api_request';

type TranslateFunction = (s: string) => string;

const Footer = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

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
    {label: t('NAV_BAR.TRADE'), path: TBDURL.TRADE},
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
        <footer className="mx-auto w-screen bg-darkGray text-base lg:justify-center">
          <div className="flex flex-col flex-wrap px-1/10 pt-24 pb-10 md:flex-row md:flex-nowrap md:items-center lg:items-start">
            <div className="mx-auto w-full shrink-0 text-center md:mx-0 md:w-1/4 md:text-left lg:w-1/6">
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

            <div className="flex grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
              <div className="w-full px-4 md:w-1/2 lg:w-1/6">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.SERVICES')}
                </h2>
                <nav className="mb-5 list-none">{servicesLinksList}</nav>
              </div>
              <div className="w-full px-4 md:w-1/2 lg:w-1/6">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.TIDEBIT')}
                </h2>
                <nav className="mb-5 list-none">{tideBitLinksList}</nav>
              </div>
              <div className="w-full px-4 md:w-1/2 lg:w-1/6">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.POLICY_CONDITIONS')}
                </h2>
                <nav className="mb-5 list-none">{policyLinksList}</nav>
              </div>

              <div className="w-full px-4 lg:ml-20 lg:mt-0 lg:w-1/3 lg:pl-50px">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  {t('FOOTER.NEWSLETTER')}
                </h2>

                <div className="flex flex-wrap items-end justify-center space-y-2 md:justify-start">
                  <div className="relative mr-2 w-2/3 sm:mr-4 sm:w-auto lg:mr-0 xl:mr-4">
                    <input
                      placeholder={t('FOOTER.EMAIL_PLACEHOLDER')}
                      type="text"
                      id="email"
                      name="email"
                      className="block w-full rounded border border-white bg-darkGray py-1 px-3 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray xl:w-220px"
                    />
                  </div>
                  <RippleButton
                    buttonType="button"
                    className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                  >
                    {t('FOOTER.SUBSCRIBE_BUTTON')}
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 pb-0">
            <div className="flex flex-col flex-wrap px-5 pt-1 pb-4 sm:flex-row sm:justify-center md:justify-end">
              <p className="text-center text-xs text-gray-400 sm:text-left md:mt-5 lg:mr-36 lg:mt-0">
                {t('FOOTER.COPYRIGHT')}
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Info: (20230328 - Julian) Mobile */}
      <div className={`${mobileVersionBreakpoint}`}>
        <footer className="mx-auto w-screen justify-center bg-darkGray text-base">
          <div className="flex flex-col flex-wrap px-1/10 pt-10 pb-10 md:flex-row md:flex-nowrap md:items-center lg:items-start">
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
                        id="email"
                        name="email"
                        className="block w-full rounded border border-white bg-darkGray py-1 px-3 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray"
                      />
                    </div>
                    <RippleButton
                      buttonType="button"
                      className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                    >
                      {t('FOOTER.SUBSCRIBE_BUTTON')}
                    </RippleButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 pb-0">
            <div className="flex flex-col flex-wrap px-5 pt-1 pb-8 sm:flex-row sm:justify-center md:justify-end">
              <p className="text-center text-xs text-gray-400 sm:text-left md:mt-5 lg:mr-36 lg:mt-0">
                {t('FOOTER.COPYRIGHT')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
