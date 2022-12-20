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
        <ul
          className="mx-3 py-1 pb-3 text-base text-gray-700 dark:text-gray-200"
          aria-labelledby="i18nButton"
        >
          {internationalizationList.map((item, index) => (
            <li key={index} onClick={clickHandler}>
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

  return (
    <div>
      <div ref={globalRef}>
        <Image
          src="/elements/globe.svg"
          width={25}
          height={25}
          className="hover:cursor-pointer hover:text-cyan-300"
          alt="icon"
          onClick={clickHandler}
        />
      </div>

      {displayedDesktopMenu}
      {displayedMobileMenu}
    </div>
  );
};

export default I18n;
