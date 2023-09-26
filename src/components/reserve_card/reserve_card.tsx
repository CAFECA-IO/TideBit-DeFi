import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {useTranslation} from 'next-i18next';
import {BiLinkAlt} from 'react-icons/bi';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';

const ReserveCard = ({
  name,
  ratio,
  userHoldings,
  walletAssets,
  icon,
  link,
  color,
}: {
  name: string;
  ratio: string;
  userHoldings: string | number;
  walletAssets: string | number;
  icon: string;
  link: string;
  color: string;
}) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {i18n} = useTranslation('common');

  const isMandarin = i18n.language === 'tw' || i18n.language === 'cn';

  const cardForTwMobile = isMandarin ? 'w-95px ml-40' : 'w-120px ml-36';
  const cardForTwDesktop = isMandarin ? 'w-95px ml-52' : 'w-120px ml-48';

  return (
    <>
      <div className="">
        <div className="w-350px p-4">
          <div className="flex h-full flex-col rounded-lg bg-darkGray4 p-8">
            <div className="mb-3 flex items-center">
              <div className="mr-3 inline-flex shrink-0 items-center justify-center rounded-full text-lightWhite">
                <Image src={icon} width={50} height={50} alt={name} />
              </div>
              <div className="flex flex-col">
                <h2 className={`text-3xl font-medium ${color}`}>{name}</h2>
                <p className="-my-1 mb-1"> {t('HOME_PAGE.RESERVE_RATIO_BLOCK_CARD')}</p>
              </div>
            </div>

            <div className="grow">
              <p className="font-bold">
                <span className="pr-2 text-6xl font-bold leading-relaxed">{ratio}</span> %
              </p>

              <Link
                // TODO: link on Etherscan and other blockchain explorers (20230619 - Shirley)
                href={link}
                target="_blank"
                className={`space-x-2 font-bold text-lightWhite transition-colors duration-300 hover:bg-lightGray1 hover:text-black ${cardForTwMobile} flex flex-row items-center rounded-full bg-lightGray3 px-3 py-1 text-sm text-lightWhite`}
              >
                <p> {t('HOME_PAGE.RESERVE_RATIO_BLOCK_CARD_2')}</p>
                <BiLinkAlt size={20} />
              </Link>
              <span className="my-auto inline-block h-px w-full rounded bg-lightGray1/30"></span>

              <div className="mb-5 flex flex-col space-y-2">
                <div className="text-base text-lightGray">
                  {' '}
                  {t('HOME_PAGE.RESERVE_RATIO_BLOCK_DESCRIPTION')}
                </div>
                <div>{userHoldings}</div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="text-base text-lightGray">
                  {' '}
                  {t('HOME_PAGE.RESERVE_RATIO_BLOCK_DESCRIPTION_2')}
                </div>
                <div>{walletAssets}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReserveCard;
