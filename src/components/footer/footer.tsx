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
      id: 'FooterFacebookLink',
      label: 'Facebook',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image src={'/elements/facebook.svg'} alt="Facebook" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
    {
      id: 'FooterInstagramLink',
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
      id: 'FooterTwitterLink',
      label: 'Twitter',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image src={'/elements/twitter.svg'} alt="twitter" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
    {
      id: 'FooterRedditLink',
      label: 'Reddit',
      path: TBDURL.COMING_SOON,
      icon: (
        <Image src={'/elements/reddit.svg'} alt="reddit" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
  ];

  const servicesLinks = [
    {id: 'FooterTradeLink', label: t('FOOTER.TRADE'), path: tradeLink},
    {id: 'FooterUniversityLink', label: t('NAV_BAR.TIDEBIT_UNIVERSITY'), path: TBDURL.COMING_SOON},
    {id: 'FooterHelpCenterLink', label: t('NAV_BAR.HELP_CENTER'), path: TBDURL.COMING_SOON},
  ];

  const tideBitLinks = [
    {id: 'FooterHiringLink', label: t('FOOTER.HIRING'), path: TBDURL.COMING_SOON},
  ];

  const policyLinks = [
    {id: 'FooterServicePolicyLink', label: t('FOOTER.SERVICE_POLICY'), path: TBDURL.COMING_SOON},
    {id: 'FooterPrivacyPolicyLink', label: t('FOOTER.PRIVACY_POLICY'), path: TBDURL.COMING_SOON},
  ];

  const socialMediaLinksList = socialMediaLinks.map(({id, label, path, icon}) => (
    <TideLink
      id={id}
      key={label}
      href={path}
      content={icon}
      className="mx-10px flex shrink-0 justify-center text-gray-400 hover:text-cyan-300"
      target="_blank"
      htmlref="noopener noreferrer"
    />
  ));

  const servicesLinksList = servicesLinks.map(({id, label, path}) => (
    <li key={label} className="mt-2 text-base">
      <TideLink id={id} href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const tideBitLinksList = tideBitLinks.map(({id, label, path}) => (
    <li key={label} className="mt-2 text-base">
      <TideLink id={id} href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const policyLinksList = policyLinks.map(({id, label, path}) => (
    <li key={label} className="mt-2 text-base">
      <TideLink id={id} href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  return (
    <footer className="px-10 py-5 w-full flex flex-col bg-darkGray text-base justify-center items-center">
      <div className="flex w-full lg:items-start items-center py-10 flex-col lg:flex-row">
        <div className="text-center flex-1 flex flex-col items-center">
          <Link
            id="FooterTideBitLogo"
            href="/#"
            className="flex flex-col items-center justify-center md:justify-start"
          >
            <Image src="/elements/footer_logo.svg" width={120} height={100} alt="TideBit_logo" />
          </Link>
          <span className="h-1px w-200px bg-white my-3"></span>
          <div className="inline-flex justify-center">{socialMediaLinksList}</div>
        </div>

        <div className="flex lg:w-3/4 py-10 lg:py-0 lg:px-16 gap-y-16 flex-col items-center lg:flex-row lg:items-start justify-between">
          <div className="flex flex-col lg:items-start items-center">
            <h2 className="text-lg font-bold tracking-widest text-white">{t('FOOTER.SERVICES')}</h2>
            <ul className="list-none flex flex-col lg:items-start items-center">
              {servicesLinksList}
            </ul>
          </div>

          <div className="flex flex-col lg:items-start items-center">
            <h2 className="text-lg font-bold tracking-widest text-white">{t('FOOTER.TIDEBIT')}</h2>
            <ul className="list-none flex flex-col lg:items-start items-center">
              {tideBitLinksList}
            </ul>
          </div>
          <div className="flex flex-col lg:items-start items-center">
            <h2 className="text-lg font-bold tracking-widest text-white">
              {t('FOOTER.POLICY_CONDITIONS')}
            </h2>
            <ul className="list-none flex flex-col lg:items-start items-center">
              {policyLinksList}
            </ul>
          </div>

          <div className="flex flex-col lg:items-start items-center">
            <h2 className="text-lg font-bold tracking-widest text-white">
              {t('FOOTER.NEWSLETTER')}
            </h2>

            <div className="flex flex-col lg:items-start items-center max-w-300px">
              <div className="relative mt-2">
                <input
                  placeholder={t('FOOTER.EMAIL_PLACEHOLDER')}
                  type="text"
                  id="FooterEmailInput"
                  name="email"
                  className="block min-w-220px rounded border border-white bg-darkGray px-3 py-1 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray xl:w-220px"
                />
              </div>
              <RippleButton
                id="FooterSubscribeButton"
                buttonType="button"
                className={`mt-4 rounded bg-tidebitTheme px-5 py-2 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none`}
              >
                {t('FOOTER.SUBSCRIBE_BUTTON')}
              </RippleButton>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:text-end text-center lg:px-16">
        <p className="text-xs text-gray-400">{COPYRIGHT}</p>
      </div>
    </footer>
  );
};

export default Footer;
