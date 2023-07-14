import {Dispatch, SetStateAction, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface II18nParams {
  langIsOpen?: boolean;
  setLangIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const I18n = ({langIsOpen, setLangIsOpen}: II18nParams) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [openMenu, setOpenMenu] =
    typeof setLangIsOpen !== 'function' ? useState(false) : [langIsOpen, setLangIsOpen];

  const {asPath} = useRouter();
  const {
    targetRef: globalRef,
    componentVisible: globalVisible,
    setComponentVisible: setGlobalVisible,
  } = useOuterClick<HTMLDivElement>(false);

  /* Info: (20230621 - Julian) 用 globalVisible 當作電腦版的選單開關，因為手機版則由 openMenu 控制 */
  const desktopClickHandler = () => {
    setGlobalVisible(!globalVisible);
  };
  const mobileClickHandler = () => {
    setOpenMenu(!openMenu);
  };

  const internationalizationList = [
    {label: '繁體中文', value: 'tw'},
    {label: 'English', value: 'en'},
    {label: '简体中文', value: 'cn'},
  ];

  const displayedDesktopMenu = (
    <div className="hidden lg:flex">
      <div
        id="i18nDropdown"
        className={`absolute right-32 top-16 z-20 w-150px ${
          globalVisible ? 'visible opacity-100' : 'invisible opacity-0'
        } divide-y divide-lightGray rounded-none bg-darkGray shadow transition-all duration-300`}
      >
        <ul className="mx-3 py-1 pb-3 text-base text-gray-200" aria-labelledby="i18nButton">
          {internationalizationList.map((item, index) => (
            <li key={index} onClick={desktopClickHandler}>
              <Link
                scroll={false}
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
  );

  const displayedMobileMenu = (
    <div
      className={`transition-all duration-300 ${
        openMenu ? 'visible opacity-100' : 'invisible opacity-0'
      } lg:hidden`}
    >
      <div
        id="i18nDropdown"
        className="absolute left-0 top-28 z-10 h-full w-screen bg-darkGray shadow"
      >
        <ul className="text-center text-base dark:text-gray-200" aria-labelledby="i18nButton">
          {internationalizationList.map((item, index) => (
            <li key={index} onClick={mobileClickHandler}>
              <Link
                scroll={false}
                locale={item.value}
                href={asPath}
                className="block rounded-none px-3 py-7 font-medium hover:cursor-pointer hover:text-tidebitTheme"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const displayedI18n = (
    <>
      <div className="hidden lg:flex">
        <div onClick={desktopClickHandler} className="hover:cursor-pointer hover:text-cyan-300">
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
      <button
        onClick={mobileClickHandler}
        type="button"
        className="inline-flex hover:text-tidebitTheme lg:hidden"
      >
        {t('NAV_BAR.LANGUAGE')}
      </button>
    </>
  );

  return (
    <div ref={globalRef}>
      {displayedI18n}
      {displayedDesktopMenu}
      {displayedMobileMenu}
    </div>
  );
};

export default I18n;
