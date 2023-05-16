import React, {useContext} from 'react';
import {UserContext} from '../../contexts/user_context';
import Image from 'next/image';
import {defaultPersonalRanking} from '../../interfaces/tidebit_defi_background/personal_ranking';
import {DEFAULT_USER_AVATAR, BADGE_LIST, TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {ProfitState} from '../../constants/profit_state';
import {numberFormatted, accountTruncate} from '../../lib/common';
import {useTranslation} from 'react-i18next';
import {
  IPersonalInfo,
  defaultPersonalInfo,
} from '../../interfaces/tidebit_defi_background/personal_info';
import {ImCross} from 'react-icons/im';
import {RiBarChart2Fill, RiDonutChartFill} from 'react-icons/ri';
import {BiTimeFive} from 'react-icons/bi';
import {FaRegThumbsUp, FaRegThumbsDown} from 'react-icons/fa';

type TranslateFunction = (s: string) => string;

interface IPersonalInfoModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getPersonalInfoData: IPersonalInfo;
}

const PersonalInfoModal = ({
  modalVisible,
  modalClickHandler,
  getPersonalInfoData,
}: IPersonalInfoModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  const {userAvatar, tradingVolume, onlineTime, diversification, hightestROI, lowestROI, badge} =
    getPersonalInfoData ?? defaultPersonalInfo;

  const userName =
    userCtx.username && userCtx.username?.length > 20
      ? accountTruncate(userCtx.username)
      : userCtx.username;

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
        <div key={title} className="flex w-100px justify-between">
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

  const displayedROI = (roi: number) => {
    const displayedRoi =
      roi > 0 ? (
        <div className="inline-flex items-center text-lightGreen5">
          + {numberFormatted(roi)} %
          <span className="ml-1 text-xs text-lightGray4">{unitAsset}</span>
        </div>
      ) : roi < 0 ? (
        <div className="inline-flex items-center text-lightRed3">
          - {numberFormatted(roi)} %
          <span className="ml-1 text-xs text-lightGray4">{unitAsset}</span>
        </div>
      ) : (
        <div className="inline-flex items-center text-lightWhite">
          {roi} % <span className="ml-1 text-xs text-lightGray4">{unitAsset}</span>
        </div>
      );
    return displayedRoi;
  };

  const detailContent = [
    {
      title: t('LEADERBOARD_PAGE.TRADING_VOLUME'),
      icon: <RiBarChart2Fill className="mr-2 text-2xl text-tidebitTheme" />,
      value: <div>{`$ ${numberFormatted(tradingVolume)}`}</div>,
    },
    {
      title: t('LEADERBOARD_PAGE.ONLINE_TIME'),
      icon: <BiTimeFive className="mr-2 text-2xl text-tidebitTheme" />,
      value: <div>{`${onlineTime} s`}</div>,
    },
    {
      title: t('LEADERBOARD_PAGE.DIVERSIFICATION'),
      icon: <RiDonutChartFill className="mr-2 text-2xl text-tidebitTheme" />,
      value: <div>{`${diversification} %`}</div>,
    },
    {
      title: t('LEADERBOARD_PAGE.HIGHTEST_ROI'),
      icon: <FaRegThumbsUp className="mr-2 text-2xl text-tidebitTheme" />,
      value: displayedROI(hightestROI),
    },
    {
      title: t('LEADERBOARD_PAGE.LOWEST_ROI'),
      icon: <FaRegThumbsDown className="mr-2 text-2xl text-tidebitTheme" />,
      value: displayedROI(lowestROI),
    },
  ];

  const displayedDetailList = detailContent.map(({title, icon, value}) => {
    return (
      <div key={title} className="inline-flex w-full justify-between">
        <div className="inline-flex items-end text-lightGray4">
          {icon}
          {title} :
        </div>
        {value}
      </div>
    );
  });

  // ToDo: (20230516 - Julian) 獲得的徽章要顯示出來 (icon)
  const displayedBadgeList = BADGE_LIST.map(({id, description, icon, iconSkeleton}) => {
    const hintFrameStyle = id % 3 === 0 ? 'right-0' : '';
    const hintArrowStyle = id % 3 === 0 ? 'right-6' : 'left-6';
    return (
      <div key={id} className="group relative mx-auto my-auto bg-darkGray8 p-4">
        <Image src={iconSkeleton} width={70} height={70} alt="daily_20_badge_icon" />
        <div
          className={`absolute -top-12 whitespace-nowrap rounded bg-black p-2 text-sm ${hintFrameStyle} opacity-0 transition-all duration-300 group-hover:opacity-100`}
        >
          <span
            className={`absolute top-8 border-x-8 border-t-20px ${hintArrowStyle} border-x-transparent border-t-black`}
          ></span>
          {description}
        </div>
      </div>
    );
  });

  const formContent = userCtx.wallet ? (
    <div className="flex w-full flex-col space-y-4 divide-y divide-lightGray overflow-y-auto overflow-x-hidden px-8 pt-4">
      {/* Info:(20230515 - Julian) User Name */}
      <div className="flex flex-col items-center space-y-6 text-lightWhite">
        <div className="text-4xl">{userName}</div>
        <div>
          <Image
            src={userAvatar ?? DEFAULT_USER_AVATAR}
            alt="user_avatar"
            width={120}
            height={120}
          />
        </div>
        <div className="inline-flex w-full justify-between px-2 text-center">
          {displayedPersonalRankingList}
        </div>
      </div>

      {/* Info:(20230515 - Julian) Detail */}
      <div className="flex flex-col space-y-6 px-4 py-6 text-sm">{displayedDetailList}</div>

      {/* ToDo:(20230515 - Julian) Badges */}
      <div className="flex flex-col px-4">
        <div className="py-4 text-lightGray">{t('LEADERBOARD_PAGE.BADGES')}</div>
        <div className="grid grid-cols-3 gap-3">{displayedBadgeList}</div>
      </div>
    </div>
  ) : null;

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-hidden outline-none backdrop-blur-sm focus:outline-none">
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
