import React from 'react';
import UserPersonalRanking from '../user_personal_ranking/user_personal_ranking';
import LeaderboardTab from '../leaderboard_tab/leaderboard_tab';
import Footer from '../footer/footer';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const BoardPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <div className="overflow-x-hidden overflow-y-hidden pt-20">
      <div className="min-h-screen">
        <div className="absolute mx-auto my-10 flex w-screen flex-col items-center space-y-4">
          <h1 className="text-3xl">{t('LEADERBOARD_PAGE.TITLE')}</h1>
          <div className="pt-250px md:pt-300px">
            <LeaderboardTab />
          </div>
        </div>
        <div className="relative flex justify-center">
          <UserPersonalRanking />
        </div>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default BoardPageBody;
