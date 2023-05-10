import React from 'react';
import UserPersonalRanking from '../user_personal_ranking/user_personal_ranking';
import Footer from '../footer/footer';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const BoardPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <div className="overflow-x-hidden overflow-y-hidden pt-20">
      <div className="min-h-screen">
        <div className="absolute mx-auto my-10 flex w-screen flex-col items-center space-y-4">
          <div>
            <h1 className="text-3xl">{t('LEADERBOARD_PAGE.TITLE')}</h1>
          </div>
          {/* ToDo: (20230509 - Julian) Top 3 */}
          <div className="h-500px w-700px bg-lightWhite"></div>
          {/* ToDo: (20230509 - Julian) Ranking List with tabs */}
          <div className="h-50px w-screen rounded-xl bg-darkGray7 md:w-8/10"></div>
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
