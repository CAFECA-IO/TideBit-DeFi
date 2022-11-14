import React from 'react';
import TideButton from '../shared/button/tide_button';
// import TideLink from '../shared/link/TideLink';
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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

  // {label: 'Terms of use', path: '/'}

  return (
    <footer className="body-font lg:justify-center">
      <div className="container px-5 pt-24 pb-10 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="lg:w-1/6 md:w-1/4 w-full px-4 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-cyan-600 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">TideBit</span>
          </a>
          <p className="mt-2 text-sm text-gray-500">
            Air plant banjo lyft occupy retro adaptogen indego
          </p>
          <div className="inline-flex pt-5 sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            {socialMediaLinks.map(({label, path, icon}) => (
              <TideLink
                key={label}
                href={path}
                content={icon}
                className="mr-3 text-gray-400 hover:text-cyan-300"
                target="_blank"
                htmlref="noopener noreferrer"
              />
            ))}
            {/* <TideLink
							href="https://twitter.com/home"
							content={
								<svg
									fill="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									className="w-5 h-5"
									viewBox="0 0 24 24"
								>
									<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
								</svg>
							}
						/>
						<a href="twitter.com/home" className="ml-3 text-gray-400">
							<svg
								fill="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								className="w-5 h-5"
								viewBox="0 0 24 24"
							>
								<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
							</svg>
						</a>
						<a className="ml-3 text-gray-400">
							<svg
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								className="w-5 h-5"
								viewBox="0 0 24 24"
							>
								<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
								<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
							</svg>
						</a>
						<a className="ml-3 text-gray-400">
							<svg
								fill="currentColor"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="0"
								className="w-5 h-5"
								viewBox="0 0 24 24"
							>
								<path
									stroke="none"
									d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
								></path>
								<circle cx="4" cy="4" r="2" stroke="none"></circle>
							</svg>
						</a> */}
          </div>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              Services
            </h2>
            <nav className="list-none mb-5">
              {servicesLinks.map(({label, path}) => (
                <li key={label} className="mt-2">
                  <TideLink
                    href={path}
                    content={label}
                    className="text-gray-400 hover:text-slate-50"
                  />
                </li>
              ))}
              {/* <li>
								<TideLink
									href="/trade"
									className="text-gray-400 hover:text-slate-50"
									content={'Trade'}
								/>
							</li>
							<li>
								<TideLink
									href="#"
									className="text-gray-400 hover:text-slate-50"
									content={'TideBit University'}
								/>
							</li>
							<li>
								<TideLink
									href="#"
									className="text-gray-400 hover:text-slate-50"
									content={'Help Center'}
								/>
							</li> */}
            </nav>
          </div>
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              TideBit
            </h2>
            <nav className="list-none mb-5">
              {tideBitLinks.map(({label, path}) => (
                <li key={label} className="mt-2">
                  <TideLink
                    href={path}
                    content={label}
                    className="text-gray-400 hover:text-slate-50"
                  />
                </li>
              ))}
              {/* <li>
								<TideLink
									href="#"
									className="text-gray-400 hover:text-slate-50"
									content={'Hiring'}
								/>
							</li> */}
            </nav>
          </div>
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              Policy & Conditions
            </h2>
            <nav className="list-none mb-5">
              {policyLinks.map(({label, path}) => (
                <li key={label} className="mt-2">
                  <TideLink
                    href={path}
                    content={label}
                    className="text-gray-400 hover:text-slate-50"
                  />
                </li>
              ))}
              {/* <li>
								<TideLink
									href="#"
									className="text-gray-400 hover:text-slate-50"
									content={'Service policy'}
								/>
							</li>
							<li>
								<TideLink
									href="#"
									className="text-gray-400 hover:text-slate-50"
									content={'Privacy policy'}
								/>
							</li> */}
            </nav>
          </div>
          <div className="lg:w-1/3 lg:ml-20 md:w-1/2 w-full px-4 md:-mt-8 lg:mt-0">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              Newsletter
            </h2>
            <div className="flex flex-wrap justify-center items-end md:justify-start space-y-2">
              <div className="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                {/* <label
									htmlFor="footer-field"
									className="leading-7 text-sm text-gray-400 text-start"
								>
									Placeholder
								</label> */}
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="w-full bg-black-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-cyan-900 focus:border-cyan-500 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <TideButton isFocus={true} content={`subscribe`.toUpperCase()} />
              {/* <button className="md:mt-2 lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
								Button
							</button> */}
            </div>
            {/* <p className="text-gray-500 text-sm mt-2 md:text-left text-center">
							Bitters chicharrones fanny pack
							<br className="lg:block hidden" />
							waistcoat green juice
						</p> */}
          </div>
        </div>
      </div>

      {/* TODO: TideBit Trade Mark */}
      <div className="bg-black-800 bg-opacity-75 md:pt-0">
        <div className="pt-1 pb-4 px-5 flex flex-wrap flex-col sm:flex-row sm:justify-center md:justify-end">
          <p className="text-gray-400 text-sm text-center sm:text-left lg:mr-36">
            TideBit © 2022
            {/* <a
							href="https://twitter.com/knyttneve"
							rel="noopener noreferrer"
							className="text-gray-500 ml-1"
							target="_blank"
						>
							@knyttneve
						</a> */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
