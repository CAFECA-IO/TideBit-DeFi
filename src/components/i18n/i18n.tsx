import {useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import Link from 'next/link';
import useOuterClick from '../../lib/hooks/use_outer_click';
// import {i18n} from 'next-i18next';
// import {initReactI18next} from 'react-i18next';

// export const testi18n = async () =>
//   await i18n?.use(initReactI18next).init({fallbackLng: 'en', debug: true});

const I18n = () => {
  // const [locale, setLocale] = useState('en');
  const [openMenu, setOpenMenu] = useState(false);
  const {locale, locales, defaultLocale, asPath} = useRouter();
  const {
    targetRef: globalRef,
    componentVisible,
    setComponentVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const clickHandler = () => {
    setOpenMenu(() => !openMenu);
    // setComponentVisible(!componentVisible);
  };

  const internationalizationList = [
    {label: '繁體中文', value: 'tw'},
    {label: 'English', value: 'en'},
  ];

  const displayedDesktopMenu = openMenu ? (
    <div className="hidden lg:flex">
      <div
        id="i18nDropdown"
        className="absolute top-16 right-52 z-10 w-150px divide-y divide-lightGray rounded-none bg-darkGray shadow"
      >
        <ul className="mx-3 py-1 pb-3 text-base text-gray-200" aria-labelledby="i18nButton">
          {internationalizationList.map((item, index) => (
            <li key={index} onClick={clickHandler}>
              <Link
                locale={item.value}
                href={asPath}
                className="block rounded-none py-2 text-center hover:bg-darkGray5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null;

  const displayedMobileMenu = openMenu ? (
    <div className="lg:hidden">
      <div
        id="i18nDropdown"
        className="absolute top-64 left-10 z-10 w-150px divide-y divide-lightGray rounded-none bg-darkGray shadow"
      >
        <ul
          className="mx-3 py-1 pb-3 text-base text-gray-700 dark:text-gray-200"
          aria-labelledby="i18nButton"
        >
          {internationalizationList.map((item, index) => (
            <li key={index}>
              <Link
                locale={item.value}
                href={asPath}
                className="block rounded-none py-2 pr-4 pl-6 hover:bg-darkGray5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null;

  const displayedI18n = (
    <>
      <div className="hidden lg:flex">
        <div
          ref={globalRef}
          onClick={clickHandler}
          className="hover:cursor-pointer hover:text-cyan-300"
        >
          <svg
            id="globe"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
          >
            <path
              id="Path_25745"
              data-name="Path 25745"
              d="M1.591,11.719H5.482a21.416,21.416,0,0,1,.487-3.906H2.615A10.872,10.872,0,0,0,1.59,11.719ZM3.524,6.25H6.391a14.478,14.478,0,0,1,1-2.4,10.469,10.469,0,0,1,.933-1.458,10.975,10.975,0,0,0-4.8,3.862ZM12.5,0A12.5,12.5,0,1,0,25,12.5,12.5,12.5,0,0,0,12.5,0Zm-.781,1.683a5.5,5.5,0,0,0-2.949,2.9A12.441,12.441,0,0,0,8.039,6.25h3.68Zm0,6.13H7.574a19.531,19.531,0,0,0-.528,3.906h4.674Zm1.563,3.906V7.813h4.145a19.444,19.444,0,0,1,.528,3.906Zm-1.563,1.563H7.047a19.531,19.531,0,0,0,.526,3.906h4.146Zm1.563,3.906V13.281h4.672a19.523,19.523,0,0,1-.526,3.906ZM11.719,18.75H8.039a12.4,12.4,0,0,0,.731,1.669,5.509,5.509,0,0,0,2.949,2.9Zm-3.4,3.862a10.461,10.461,0,0,1-.933-1.458,14.48,14.48,0,0,1-1-2.4H3.524a10.975,10.975,0,0,0,4.8,3.862ZM2.615,17.188H5.969a21.33,21.33,0,0,1-.487-3.906H1.59a10.836,10.836,0,0,0,1.025,3.906Zm14.061,5.425a10.975,10.975,0,0,0,4.8-3.862H18.61a14.5,14.5,0,0,1-1,2.4,10.45,10.45,0,0,1-.933,1.458Zm.285-3.862h-3.68v4.567a5.5,5.5,0,0,0,2.949-2.9,12.469,12.469,0,0,0,.731-1.669Zm2.07-1.562h3.353a10.822,10.822,0,0,0,1.025-3.906H19.519a21.328,21.328,0,0,1-.487,3.906Zm.487-5.469H23.41a10.874,10.874,0,0,0-1.025-3.906H19.031a21.477,21.477,0,0,1,.487,3.906Zm-.91-5.469a14.5,14.5,0,0,0-1-2.4,10.456,10.456,0,0,0-.933-1.458,10.975,10.975,0,0,1,4.8,3.862H18.61Zm-1.649,0H13.281V1.683a5.5,5.5,0,0,1,2.949,2.9,12.441,12.441,0,0,1,.731,1.669Z"
              fill="#edecec"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <button type="button" className="inline-flex hover:text-tidebitTheme lg:hidden">
        Language
      </button>
    </>
  );

  return (
    <div>
      {displayedI18n}
      {displayedDesktopMenu}
      {displayedMobileMenu}
    </div>
  );
};

export default I18n;
