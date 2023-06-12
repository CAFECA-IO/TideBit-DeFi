import Image from 'next/image';
import React from 'react';
import {BiArrowBack} from 'react-icons/bi';
import NavBar from '../nav_bar/nav_bar';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {timestampToString} from '../../lib/common';
import {ISocialMedia, ShareSettings, SocialMediaConstant} from '../../constants/social_media';
import useShareProcess from '../../lib/hooks/use_share_process';
import {ShareType} from '../../constants/share_type';
import {NEWS_IMG_HEIGHT, NEWS_IMG_WIDTH} from '../../constants/display';

interface IRecommendedNews {
  newsId: string;
  img: string;
  timestamp: number;
  title: string;
  description: string;
}

interface INews {
  newsId: string;
  img: string;
  timestamp: number;
  title: string;
  content: string;
}

interface INewsArticle {
  shareId: string;

  news: INews;
  recommendations?: Array<IRecommendedNews>;
}

const NewsArticle = ({shareId, news, recommendations}: INewsArticle) => {
  const date = timestampToString(news.timestamp || 0).date;
  const socialMediaStyle = 'hover:cursor-pointer hover:opacity-80';

  const {share} = useShareProcess({
    lockerName: 'news_article.shareHandler',
    shareType: ShareType.ARTICLE,
    shareId: shareId,
  });

  return (
    <div className="bg-gradient-to-r from-darkGray1/80 via-black to-black pb-20">
      <div className="ml-5 h-10 w-6 pt-24 pb-14 transition-all duration-200 hover:opacity-70 lg:hidden">
        <Link href="/news">
          <BiArrowBack size={25} />
        </Link>{' '}
      </div>

      <div className="flex w-full justify-center lg:pt-36">
        <div className="hidden h-10 w-6 transition-all duration-200 hover:opacity-70 lg:-ml-20 lg:mr-20 lg:flex">
          <Link href="/news">
            <BiArrowBack size={25} />
          </Link>
        </div>
        <div className="w-full px-5 md:w-90vw lg:w-70vw xl:w-3/5">
          <Image
            src={news.img}
            style={{objectFit: 'cover'}}
            width={NEWS_IMG_WIDTH}
            height={NEWS_IMG_HEIGHT}
            alt="image"
          />
          <div className="my-8 flex justify-between">
            {' '}
            <h1 className="pr-10 text-xl font-normal leading-8 tracking-wider">{news.title}</h1>
            <p className="mt-2 text-xs text-lightGray lg:text-sm">{date}</p>
          </div>

          {/* TODO: markdown (20230602 - Shirley) */}
          {/* <p className="text-base leading-10 tracking-normal text-lightGray1"></p> */}
          {/* <div className="prose mt-5 max-w-none leading-10 tracking-normal">{news.content}</div> */}

          <div className="my-16 text-lightGray">
            <div className="mb-3">Share this on</div>
            <div className="flex justify-start space-x-5">
              {Object.entries(ShareSettings).map(([key, value]) => (
                <div key={key} className={`${socialMediaStyle}`}>
                  <Image
                    onClick={() => share({socialMedia: key as ISocialMedia, text: value.TEXT})}
                    src={value.ICON}
                    width={44}
                    height={44}
                    alt={key}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {recommendations ? (
        <>
          <div className="mx-10 border-b border-dashed border-white/50"></div>

          <div className="md:mx-20">
            <div className="mx-5 my-10 text-base text-lightGray md:mx-0">
              You might also like ...
            </div>
            <div className="mx-0 flex-col space-y-16 lg:grid lg:grid-cols-3 lg:gap-2 xl:mx-12">
              {recommendations.map((item, index) => (
                <div
                  key={item.newsId}
                  className={`${
                    index === 0 ? `mt-16` : ``
                  } mx-auto w-300px flex-col items-center space-y-4 md:w-400px lg:w-250px xl:w-300px 2xl:w-400px`}
                >
                  <Link href={`/news/${item.newsId}`}>
                    <Image
                      className=""
                      src={item.img}
                      style={{objectFit: 'cover'}}
                      width={400}
                      height={100}
                      alt={`news img`}
                    />
                    <div className="my-5 text-xl text-lightWhite">{item.title}</div>
                    <div className="text-sm text-lightWhite">{item.description}</div>
                    <div className="my-5 text-sm text-lightGray">
                      {timestampToString(item.timestamp).date}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default NewsArticle;
