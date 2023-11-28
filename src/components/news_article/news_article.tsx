import Image from 'next/image';
import React from 'react';
import {BiArrowBack} from 'react-icons/bi';
import Link from 'next/link';
import {timestampToString, truncateText} from '../../lib/common';
import {ISocialMedia, ShareSettings} from '../../constants/social_media';
import useShareProcess from '../../lib/hooks/use_share_process';
import {ShareType} from '../../constants/share_type';
import {NEWS_INTRODUCTION_IN_TRADE_MAX_LENGTH} from '../../constants/display';
import {IPost} from '../../lib/posts';

interface IRecommendedNews {
  newsId: string;
  img: string;
  timestamp: number;
  title: string;
  description: string;
}

interface INewsArticle {
  shareId: string;
  post: IPost;
  img: string;
  recommendations?: Array<IRecommendedNews>;
}

const NewsArticle = ({shareId, img, post, recommendations}: INewsArticle) => {
  const socialMediaStyle = 'hover:cursor-pointer hover:opacity-80';

  const {share} = useShareProcess({
    lockerName: 'news_article.shareHandler',
    shareType: ShareType.ARTICLE,
    shareId: shareId,
  });

  const displayedDate = timestampToString(post.date).date;

  const parsedBody = post.body
    .replace(
      /<h3 id="([^"]+)"><strong>([^<]+)<\/strong><\/h3>/g,
      `<h3 id="$1" class="font-bold text-xl my-3">$2</h3>`
    )
    .replace(/<li>(<\/li>)?/g, `<li class="list-disc ml-5">$1`)
    .replace(
      /<a /g,
      `<a class="text-blue-300 underline hover:text-blue-500 transition-all duration-150" `
    );

  return (
    <div className="w-full flex flex-col bg-gradient-to-r from-darkGray1/80 via-black to-black pb-20">
      <div className="mx-auto max-w-1920px">
        <div className="ml-5 h-10 w-6 pt-24 pb-14 transition-all duration-200 hover:opacity-70 lg:hidden">
          <Link href="/news">
            <BiArrowBack size={25} />
          </Link>{' '}
        </div>

        <div className="flex w-full justify-center lg:pt-36">
          <div className="hidden h-10 w-6 transition-all duration-200 hover:opacity-70 -ml-0 mr-0 lg:-ml-10 lg:mr-20 lg:flex">
            <Link href="/news">
              <BiArrowBack size={25} />
            </Link>
          </div>

          <div className="px-1 w-90vw md:w-80vw lg:w-70vw">
            <Image
              src={img}
              style={{width: '100%', height: 'auto'}}
              sizes="80vw"
              width={0}
              height={0}
              alt="image"
            />
            <div className="my-8 flex justify-between">
              {' '}
              <h1 className="text-xl font-normal leading-8 tracking-wider">{post.title}</h1>
              <p className="mt-2 text-xs text-lightGray lg:text-sm">{displayedDate}</p>
            </div>

            <div className="prose mt-5 leading-10 tracking-normal text-ellipsis overflow-hidden">
              <article dangerouslySetInnerHTML={{__html: parsedBody}} />
            </div>

            <div className="my-16 text-lightGray">
              <div className="mb-3">Share this on</div>
              <div className="flex justify-start space-x-5">
                {Object.entries(ShareSettings).map(([key, value]) => (
                  <div id={`ShareTo${key}`} key={key} className={`${socialMediaStyle}`}>
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
      </div>
      {/*           <div className="mx-auto max-w-1920px flex justify-around">
       */}
      {recommendations && recommendations?.length > 0 ? (
        <>
          <div className="lg:mx-10 border-b border-dashed border-white/50"></div>
          <div className="w-full flex justify-center">
            <div className="md:mx-0 max-w-1920px mx-auto">
              <div className="mx-5 my-10 text-base text-lightGray md:mx-0">
                You might also like ...
              </div>
              <div className="mx-0 flex-col space-y-16 lg:grid lg:grid-cols-3 lg:gap-2 xl:mx-12 space-x-20">
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
                        src={`${item.img}`}
                        style={{objectFit: 'cover'}}
                        width={400}
                        height={100}
                        alt={`news img`}
                      />
                      <div className="my-5 text-xl text-lightWhite">{item.title}</div>
                      <div className="text-sm text-lightWhite">
                        {truncateText(item.description, NEWS_INTRODUCTION_IN_TRADE_MAX_LENGTH)}
                      </div>
                      <div className="my-5 text-sm text-lightGray">
                        {timestampToString(item.timestamp).date}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default NewsArticle;
