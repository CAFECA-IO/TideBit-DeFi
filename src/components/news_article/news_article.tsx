import Image from 'next/image';
import React from 'react';
import {BiArrowBack} from 'react-icons/bi';
import NavBar from '../nav_bar/nav_bar';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {timestampToString} from '../../lib/common';
import {ShareSettings} from '../../constants/social_media';
import useShareProcess from '../../lib/hooks/use_share_process';
import {ShareType} from '../../constants/share_type';

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

  const {shareTo} = useShareProcess({
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
        <div className="w-600px px-5">
          <Image src={news.img} width={600} height={100} alt="image" />
          <div className="my-8 flex justify-between">
            {' '}
            <h1 className="text-xl font-normal leading-8 tracking-wider">{news.title}</h1>
            <p className="mt-2 mr-2 text-sm text-lightGray">{date}</p>
          </div>
          <p className="text-base leading-10 tracking-normal text-lightGray1">
            {news.content}
            <span className="bg-blue-500">a over 5% depreciation</span>
          </p>

          <div className="my-16 text-lightGray">
            <div className="mb-3">Share this on</div>
            <div className="flex justify-start space-x-5">
              {Object.entries(ShareSettings).map(([key, value]) => (
                <div key={key} className={`${socialMediaStyle}`}>
                  <Image
                    onClick={() =>
                      shareTo({
                        url: value.URL,
                        appUrl: value.APP_URL,
                        text: value.TEXT,
                        type: value.TYPE,
                        size: value.SIZE,
                      })
                    }
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
      {/* After divider */}

      {recommendations ? (
        <>
          <div className="mx-10 border-b border-dashed border-white/50"></div>

          <div className="md:mx-20">
            <div className="mx-5 my-10 text-base text-lightGray md:mx-0">
              You might also like ...
            </div>
            <div className="mx-0 flex-col space-y-16 lg:grid lg:grid-cols-3 lg:gap-2 xl:mx-12">
              {/*  h-full w-full flex-wrap content-center items-center justify-center text-center */}
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
