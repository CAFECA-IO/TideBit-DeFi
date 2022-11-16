import React from 'react';
import TideButton from '../shared/button/tide_button';
import TideLink from '../shared/link/tide_link';

const Footer = () => {
  const socialMediaLinks = [
    {
      label: 'Twitter',
      path: 'https://twitter.com/tidebit',
      icon: (
        <svg
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      path: 'https://www.facebook.com/tidebit',
      icon: (
        <svg
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      path: 'https://www.instagram.com/tidebit',
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      path: 'https://www.linkedin.com/company/tidebit',
      icon: (
        <svg
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <path
            stroke="none"
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          ></path>
          <circle cx="4" cy="4" r="2" stroke="none"></circle>
        </svg>
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
      className="mx-1.5 flex justify-center text-gray-400 hover:text-cyan-300"
      target="_blank"
      htmlref="noopener noreferrer"
    />
  ));

  const servicesLinksList = servicesLinks.map(({label, path}) => (
    <li key={label} className="mt-2">
      <TideLink href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const tideBitLinksList = tideBitLinks.map(({label, path}) => (
    <li key={label} className="mt-2">
      <TideLink href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  const policyLinksList = policyLinks.map(({label, path}) => (
    <li key={label} className="mt-2">
      <TideLink href={path} content={label} className="text-gray-400 hover:text-slate-50" />
    </li>
  ));

  return (
    <footer className="body-font -mb-20 lg:justify-center">
      <div className="-px-20 container mx-auto flex flex-col flex-wrap pt-24 pb-10 md:flex-row md:flex-nowrap md:items-center lg:items-start">
        <div className="mx-auto w-full flex-shrink-0 px-4 text-center md:mx-0 md:w-1/4 md:text-left lg:w-1/6">
          <a className="title-font flex flex-col items-center justify-center font-medium text-white md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-14 w-14 rounded-full bg-cyan-600 p-2 text-white"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <p className="mt-2 text-xl text-white">TideBit</p>
          </a>
          <span className="container mx-auto mt-2 -mb-2 mb-3 flex h-px w-[120px] justify-center rounded bg-white"></span>

          <div className="container mx-auto mt-2 inline-flex justify-center pt-5 sm:mt-0 ">
            {socialMediaLinksList}
          </div>
        </div>
        <div className="-mb-10 mt-10 flex flex-grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
          <div className="w-full px-4 md:w-1/2 lg:w-1/6">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest text-white">
              Services
            </h2>
            <nav className="mb-5 list-none">{servicesLinksList}</nav>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/6">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest text-white">
              TideBit
            </h2>
            <nav className="mb-5 list-none">{tideBitLinksList}</nav>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/6">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest text-white">
              Policy & Conditions
            </h2>
            <nav className="mb-5 list-none">{policyLinksList}</nav>
          </div>
          <div className="w-full px-4 md:-mt-8 md:w-1/2 lg:ml-20 lg:mt-0 lg:w-1/3">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest text-white">
              Newsletter
            </h2>
            <div className="flex flex-wrap items-end justify-center space-y-2 md:justify-start">
              <div className="relative mr-2 w-40 sm:mr-4 sm:w-auto lg:mr-0 xl:mr-4">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="block w-full rounded border border-white bg-black py-1 px-3 text-base leading-8 text-white outline-none ring-transparent transition-colors duration-200 ease-in-out focus:bg-black active:bg-black"
                />
              </div>
              <TideButton isFocus={false} content={`subscribe`.toUpperCase()} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black-800 bg-opacity-75 md:pt-0">
        <div className="flex flex-col flex-wrap px-5 pt-1 pb-4 sm:flex-row sm:justify-center md:justify-end">
          <p className="text-center text-sm text-gray-400 sm:text-left lg:mr-36">TideBit © 2022</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
