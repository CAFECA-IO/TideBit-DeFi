import {useEffect, useState} from 'react';
import {AlertState, IAlertData, IAlertStateType} from '../../interfaces/alert';
import {
  TOAST_DURATION_SECONDS,
  CHINESE_CHARACTER_LENGTH_FOR_ALERT,
  ENGLISH_CHARACTER_LENGTH_FOR_ALERT,
} from '../../constants/display';
import {isIncludingChinese, truncateText} from '../../lib/common';

interface IAlertProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  data: IAlertData;
}

const warningSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path
      d="M24.1651 5.75C23.7185 4.9765 22.8932 4.5 22 4.5C21.1068 4.5 20.2815 4.9765 19.8349 5.75L4.24648 32.75C3.7999 33.5235 3.7999 34.4765 4.24648 35.25C4.69306 36.0235 5.51838 36.5 6.41154 36.5H37.5885C38.4816 36.5 39.3069 36.0235 39.7535 35.25C40.2001 34.4765 40.2001 33.5235 39.7535 32.75L24.1651 5.75Z"
      stroke="#F8E71C"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M22 17L22 22"
      stroke="#F8E71C"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="22" cy="29" r="3" transform="rotate(-180 22 29)" fill="#F8E71C" />
  </svg>
);

const errorSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path
      d="M20.1875 37.375C29.6799 37.375 37.375 29.6799 37.375 20.1875C37.375 10.6951 29.6799 3 20.1875 3C10.6951 3 3 10.6951 3 20.1875C3 29.6799 10.6951 37.375 20.1875 37.375Z"
      stroke="#E86D6D"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25 25L15 15"
      stroke="#E86D6D"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25 15L15 25"
      stroke="#E86D6D"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function getBorderColor(type: IAlertStateType) {
  switch (type) {
    case AlertState.WARNING:
      return 'border-lightYellow2';
    case AlertState.ERROR:
      return 'border-lightRed';
    default:
      return 'border-lightYellow2';
  }
}

function getAlertSvg(type: IAlertStateType) {
  switch (type) {
    case AlertState.WARNING:
      return warningSvg;
    case AlertState.ERROR:
      return errorSvg;
    default:
      return warningSvg;
  }
}

const Alert = ({modalVisible, modalClickHandler, data}: IAlertProps) => {
  const message = isIncludingChinese(data.message)
    ? truncateText(data.message, CHINESE_CHARACTER_LENGTH_FOR_ALERT)
    : truncateText(data.message, ENGLISH_CHARACTER_LENGTH_FOR_ALERT);

  const alertUI = (
    <div
      className={`${getBorderColor(
        data.type
      )} w-530px h-76px px-6 py-4 bg-gray-800 rounded-10px shadow border-b-4 justify-center items-start gap-10 inline-flex`}
    >
      <div className="w-11 self-stretch justify-center items-center gap-2.5 flex">
        <div className="w-11 h-11 pl-5px pr-5px py-5px justify-center items-center flex">
          <div className="w-34px h-34px relative">{getAlertSvg(data.type)}</div>
        </div>
      </div>
      <div className="grow shrink basis-0 h-30px justify-center items-center gap-2.5 flex">
        <div className="grow shrink basis-0 text-zinc-100 text-xs font-normal font-inter">
          {message}
        </div>
      </div>
      <div className="w-6 h-6 p-1.5 justify-center items-center flex"></div>
    </div>
  );

  const isDisplayedAlert = (
    <div>
      <div
        className={`fixed inset-0 z-60 flex items-start ${
          modalVisible ? `translate-y-11` : `-translate-y-40`
        } duration-300 justify-center overflow-x-hidden overflow-y-hidden outline-none backdrop-blur-none focus:outline-none pointer-events-none`}
      >
        <div className={`relative mx-auto my-6`}>
          <div
            id="AnnouncementModal"
            className={`relative flex h-auto max-h-600px flex-col space-y-4 rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none pointer-events-auto`}
          >
            {alertUI}
          </div>
        </div>
      </div>
    </div>
  );
  return <>{isDisplayedAlert}</>;
};

export default Alert;
