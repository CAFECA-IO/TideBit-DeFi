import Image from 'next/image';
import React from 'react';
import TideButton from '../tide_button/tide_button';
import TideLink from '../tide_link/tide_link';
import RippleButton from '../ripple_button/ripple_button';

const Footer = () => {
  const ICON_SIZE = 30;
  const socialMediaLinks = [
    {
      label: 'Facebook',
      path: 'https://twitter.com/tidebit',
      icon: (
        <Image src={'/elements/facebook.svg'} alt="Facebook" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
    {
      label: 'Instagram',
      path: 'https://www.facebook.com/tidebit',
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
      path: 'https://www.instagram.com/tidebit',
      icon: (
        <Image src={'/elements/twitter.svg'} alt="twitter" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
    {
      label: 'Reddit',
      path: 'https://www.linkedin.com/company/tidebit',
      icon: (
        <Image src={'/elements/reddit.svg'} alt="reddit" width={ICON_SIZE} height={ICON_SIZE} />
      ),
    },
  ];

  const servicesLinks = [
    {label: 'Trade', path: '/'},
    {label: 'TideBit University', path: '/'},
    {label: 'Help Center', path: '/'},
  ];

  const tideBitLinks = [{label: 'Hiring', path: '/'}];

  const policyLinks = [
    {label: 'Service policy', path: '/'},
    {label: 'Privacy policy', path: '/'},
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
      {/* Desktop */}
      <div className={`${desktopVersionBreakpoint}`}>
        <footer className="mx-auto w-screen bg-darkGray text-base lg:justify-center">
          <div className="flex flex-col flex-wrap px-1/10 pt-24 pb-10 md:flex-row md:flex-nowrap md:items-center lg:items-start">
            <div className="mx-auto w-full shrink-0 text-center md:mx-0 md:w-1/4 md:text-left lg:w-1/6">
              <a className="flex flex-col items-center justify-center font-medium text-white md:justify-start">
                <Image src="/elements/footer_logo.svg" width={120} height={100} alt="TideBit" />
              </a>
              <span className="mt-3 flex h-px w-full justify-center rounded bg-white xl:w-full"></span>

              <div className="container mx-auto inline-flex justify-center pt-3 sm:mt-0">
                {socialMediaLinksList}
              </div>
            </div>
            <div className="flex grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
              <div className="w-full px-4 md:w-1/2 lg:w-1/6">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">Services</h2>
                <nav className="mb-5 list-none">{servicesLinksList}</nav>
              </div>
              <div className="w-full px-4 md:w-1/2 lg:w-1/6">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">TideBit</h2>
                <nav className="mb-5 list-none">{tideBitLinksList}</nav>
              </div>
              <div className="w-full px-4 md:w-1/2 lg:w-1/6">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                  Policy & Conditions
                </h2>
                <nav className="mb-5 list-none">{policyLinksList}</nav>
              </div>

              <div className="w-full px-4 lg:ml-20 lg:mt-0 lg:w-1/3 lg:pl-50px">
                <h2 className="mb-3 text-lg font-bold tracking-widest text-white">Newsletter</h2>

                <div className="flex flex-wrap items-end justify-center space-y-2 md:justify-start">
                  <div className="relative mr-2 w-2/3 sm:mr-4 sm:w-auto lg:mr-0 xl:mr-4">
                    <input
                      placeholder="Email Address"
                      type="text"
                      id="email"
                      name="email"
                      className="block w-full rounded border border-white bg-darkGray py-1 px-3 text-sm leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-darkGray active:bg-darkGray xl:w-220px"
                    />
                  </div>
                  {/* <TideButton className="text-sm">SUBSCRIBE</TideButton> */}
                  <RippleButton
                    buttonType="button"
                    className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-sm text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                  >
                    SUBSCRIBE
                  </RippleButton>
                  {/*  <button className="mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-colors duration-300 ease-out hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0">
                SUBSCRIBE
              </button> */}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 pb-0">
            <div className="flex flex-col flex-wrap px-5 pt-1 pb-4 sm:flex-row sm:justify-center md:justify-end">
              <p className="text-center text-xs text-gray-400 sm:text-left md:mt-5 lg:mr-36 lg:mt-0">
                TideBit © 2022
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile */}
      <div className={`${mobileVersionBreakpoint}`}>
        <footer className="mx-auto w-screen justify-center bg-darkGray text-base">
          <div className="flex flex-col flex-wrap px-1/10 pt-24 pb-10 md:flex-row md:flex-nowrap md:items-center lg:items-start">
            {/* LOGO & Social media */}
            <div className="mx-auto w-full shrink-0 text-center">
              <a className="flex flex-col items-center justify-center font-medium text-white md:justify-start">
                <Image src="/elements/footer_logo.svg" width={120} height={100} alt="TideBit" />
              </a>
              <span className="container mx-auto mt-3 flex h-px w-150px justify-center rounded bg-white"></span>

              <div className="container mx-auto inline-flex justify-center pt-3">
                {socialMediaLinksList}
              </div>

              {/* Links & Newsletter */}
              <div className="mt-10 flex grow flex-col flex-wrap text-center">
                <div className="w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">Services</h2>
                  <nav className="mb-5 list-none">{servicesLinksList}</nav>
                </div>
                <div className="w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">TideBit</h2>
                  <nav className="mb-5 list-none">{tideBitLinksList}</nav>
                </div>
                <div className="w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">
                    Policy & Conditions
                  </h2>
                  <nav className="mb-5 list-none">{policyLinksList}</nav>
                </div>
                <div className="w-full">
                  <h2 className="mb-3 text-lg font-bold tracking-widest text-white">Newsletter</h2>

                  <div className="flex flex-col flex-wrap items-center justify-center">
                    <div className="relative w-220px md:mb-5">
                      <input
                        placeholder="Email Address"
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
                      SUBSCRIBE
                    </RippleButton>
                    {/*  <button className="mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-colors duration-300 ease-out hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0">
                SUBSCRIBE
              </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 pb-0">
            <div className="flex flex-col flex-wrap px-5 pt-1 pb-4 sm:flex-row sm:justify-center md:justify-end">
              <p className="text-center text-xs text-gray-400 sm:text-left md:mt-5 lg:mr-36 lg:mt-0">
                TideBit © 2022
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
