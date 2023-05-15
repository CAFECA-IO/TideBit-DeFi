import React, {useContext} from 'react';
import {UserContext} from '../../contexts/user_context';
import Image from 'next/image';
import {defaultPersonalRanking} from '../../interfaces/tidebit_defi_background/personal_ranking';
import {DEFAULT_USER_AVATAR, TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {ProfitState} from '../../constants/profit_state';
import {numberFormatted} from '../../lib/common';
import {useTranslation} from 'react-i18next';
import {ImCross} from 'react-icons/im';
import {RiBarChart2Fill, RiDonutChartFill} from 'react-icons/ri';
import {BiTimeFive} from 'react-icons/bi';
import {FaRegThumbsUp, FaRegThumbsDown} from 'react-icons/fa';

type TranslateFunction = (s: string) => string;

interface IPersonalInfoModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  //getPersonalInfoData:
}

const PersonalInfoModal = ({
  modalVisible,
  modalClickHandler,
}: //getPersonalInfoData,
IPersonalInfoModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  // TODO: (20230515 - Julian) Get data from userCtx
  const userName = 'Julian'; //userCtx.username
  const userAvatar = DEFAULT_USER_AVATAR;

  const userRankingDaily = userCtx.getPersonalRanking('DAILY') ?? defaultPersonalRanking;
  const userRankingWeekly = userCtx.getPersonalRanking('WEEKLY') ?? defaultPersonalRanking;
  const userRankingMonthly = userCtx.getPersonalRanking('MONTHLY') ?? defaultPersonalRanking;

  const personalRankingContent = [
    {title: t('LEADERBOARD_PAGE.DAILY'), ...userRankingDaily},
    {title: t('LEADERBOARD_PAGE.WEEKLY'), ...userRankingWeekly},
    {title: t('LEADERBOARD_PAGE.MONTHLY'), ...userRankingMonthly},
  ];

  const displayedPersonalRankingList = personalRankingContent.map(
    ({title, rank, cumulativePnl}) => {
      const displayedRank = rank <= 0 ? '-' : rank;

      const displayedPnl =
        rank <= 0 ? (
          <div>-</div>
        ) : cumulativePnl.type === ProfitState.PROFIT ? (
          <div className={`${TypeOfPnLColor.PROFIT}`}>{`+ ${numberFormatted(
            cumulativePnl.value
          )}`}</div>
        ) : cumulativePnl.type === ProfitState.LOSS ? (
          <div className={`${TypeOfPnLColor.LOSS}`}>{`- ${numberFormatted(
            cumulativePnl.value
          )}`}</div>
        ) : (
          <div className={`${TypeOfPnLColor.EQUAL}`}>{numberFormatted(cumulativePnl.value)}</div>
        );

      return (
        <div className="flex w-100px justify-between">
          <div className="flex flex-col items-center">
            <div className="text-sm text-lightGray4">{title}</div>
            <div className="inline-flex items-center">
              {displayedPnl}
              <span className="ml-1 text-xs text-lightGray4">{unitAsset}</span>
            </div>
            <div className="inline-flex items-center">
              <Image src="/leaderboard/crown.svg" alt="crown_icon" width={15} height={15} />
              <span className="ml-1">{displayedRank}</span>
            </div>
          </div>
        </div>
      );
    }
  );

  // TODO: (20230515 - Julian) Get value from userCtx, and i18n
  const detailContent = [
    {
      title: 'Trading volume',
      icon: <RiBarChart2Fill className="mr-2 text-2xl text-tidebitTheme" />,
      value: '$ 12,390',
    },
    {
      title: 'Online time',
      icon: <BiTimeFive className="mr-2 text-2xl text-tidebitTheme" />,
      value: '592 Day 5 Hours 39 Minutes',
    },
    {
      title: 'Diversification',
      icon: <RiDonutChartFill className="mr-2 text-2xl text-tidebitTheme" />,
      value: '67.35 %',
    },
    {
      title: 'Highest ROI',
      icon: <FaRegThumbsUp className="mr-2 text-2xl text-tidebitTheme" />,
      value: '+ 53.35 % USDT',
    },
    {
      title: 'Lowest ROI :',
      icon: <FaRegThumbsDown className="mr-2 text-2xl text-tidebitTheme" />,
      value: '- 33.55 % USDT',
    },
  ];

  const displayedDetailList = detailContent.map(({title, icon, value}) => {
    return (
      <div className="inline-flex w-full justify-between">
        <div className="inline-flex items-end text-lightGray4">
          {icon}
          {title} :
        </div>
        <div>{value}</div>
      </div>
    );
  });

  const formContent = (
    <div className="flex w-full flex-col space-y-4 divide-y divide-lightGray overflow-y-auto px-8 pt-4">
      {/* Info:(20230515 - Julian) User Name */}
      <div className="flex flex-col items-center space-y-6 text-lightWhite">
        <div className="text-4xl">{userName}</div>
        <div>
          <Image src={userAvatar} alt="user_avatar" width={120} height={120} />
        </div>
        <div className="inline-flex w-full justify-between px-2 text-center">
          {displayedPersonalRankingList}
        </div>
      </div>

      {/* Info:(20230515 - Julian) Detail */}
      <div className="flex flex-col space-y-6 px-4 py-6 text-sm">{displayedDetailList}</div>

      {/* ToDo:(20230515 - Julian) Badges */}
      <div className="flex flex-col px-4 py-3">
        <div className="text-lightGray">Badges</div>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div
            id="personalInfoModal"
            className="relative flex h-726px w-screen flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none md:w-450px"
          >
            {/* Info:(20230515 - Julian) Header */}
            <div className="flex items-center justify-between rounded-t pt-9">
              <button className="float-right ml-auto bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>

            {/* Info:(20230515 - Julian) Body */}
            {formContent}

            {/* Info:(20230515 - Julian) Footer */}
            <div className="flex items-center justify-end rounded-b p-4"></div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default PersonalInfoModal;
