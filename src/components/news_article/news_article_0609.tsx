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

const NewsArticle0609 = ({shareId, news, recommendations}: INewsArticle) => {
  const date = timestampToString(news.timestamp || 0).date;
  const socialMediaStyle = 'hover:cursor-pointer hover:opacity-80';

  const {share} = useShareProcess({
    lockerName: 'news_article_0609.shareHandler',
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

          <div className="prose mt-5 max-w-none leading-10 tracking-normal">
            <h2 className="mb-5 text-xl font-bold">Introduction</h2>
            <p className="mb-5">
              The dynamism of the global financial landscape, particularly the crypto market, is
              marked by the interplay of policies, technology, and economics. We'll focus on these
              aspects, playing pivotal roles in sculpting the future of cryptocurrency. Further, our
              analysis suggests{' '}
              <span className="font-bold">
                a potential 3% increase in the Ethereum price from June 10-16, 2023.
              </span>
            </p>
            <h2 className="mb-5 text-xl font-bold">International Policy</h2>
            <p className="mb-5">
              <span className="font-bold">Hong Kong</span> is becoming a major crypto hub due to its
              strategic regulatory moves. Hong Kong's distinct approach to regulation, including
              recognition of crypto assets under existing laws and the requirement for all crypto
              firms to be licensed, is fostering a conducive environment for crypto growth.
            </p>
            <p className="mb-5">
              <span className="font-bold">Japan's</span> policies, leveraging its tech strength,
              have made strides in the crypto sector. Japan's introduction of the Payment Services
              Act, which recognizes crypto as a legal form of payment, has boosted the country's
              crypto growth. Meanwhile, Japan's regulatory body, the Financial Services Agency, has
              created a regulatory sandbox for fintech innovation, thereby nurturing a favorable
              environment.
            </p>
            <p className="mb-5">
              <span className="font-bold">London's</span> regulatory environment is also fueling its
              crypto market. Evertas, a London-based crypto insurer, was granted authorization to
              offer services, suggesting London's flexible regulatory stance.
            </p>
            <p className="mb-5">
              Moreover, European officials believe <span className="font-bold">US SEC's</span>{' '}
              intensified enforcement could create opportunities for Europe, including the UK, to
              attract more crypto-related businesses.
            </p>
            <h2 className="mb-5 text-xl font-bold">Technological advancements</h2>
            <p className="mb-5">
              In the realm of technological advancements, there’s some progression happening in
              zkSync and Optimism.
            </p>
            <p className="mb-5">
              <span className="font-bold">zkSync</span>, a Layer-2 scaling solution, is pioneering
              efficiency and scalability in blockchain transactions. Its notable development, the{' '}
              <span className="font-bold">"Era Rocket Pool"</span>, uses zero-knowledge proofs to
              achieve significant transaction speed and reduce gas costs. This step represents a
              critical breakthrough, as the technology resolves two of the most pressing concerns in
              blockchain applications: scalability and high transaction fees. The innovation
              promises to revolutionize not just the DeFi sector but the entire cryptocurrency
              landscape, by allowing for more participants and transactions at a lower cost.
            </p>
            <p className="mb-5">
              <span className="font-bold">
                Optimism is another trailblazer in this field. The company's recently completed
                "Bedrock" hard fork introduces a new era in transaction speed and security.
              </span>{' '}
              The hard fork involves an upgraded Ethereum Layer-2 scaling solution, designed to
              handle more transactions while increasing their security. This advancement is
              especially crucial in the context of the growing demand for secure and efficient
              crypto transactions. The "Bedrock" hard fork underscores the progress being made in
              the realm of blockchain technology and lays the foundation for further advancements in
              transactional speed and security in the crypto world.
            </p>
            <h2 className="mb-5 text-xl font-bold">Economic Outlook and Trends</h2>
            <p className="mb-5">
              US President Biden's recent signing of the{' '}
              <span className="font-bold">debt ceiling bill averts a default crisis</span>, ensuring
              economic stability. Coupled with the BLS's latest employment report indicating job
              growth, these factors are fostering a healthy investment environment.
            </p>
            <p className="mb-5">
              Moreover, the Bureau of Labor Statistics (BLS) released{' '}
              <span className="font-bold">a promising employment report</span>. It shows encouraging
              signs of job growth, a key indicator of a healthy and recovering economy. The positive
              economic news suggests a robust job market, increased consumer spending, and overall
              economic growth, conditions typically associated with a thriving investment ecosystem.
            </p>
            <p className="mb-5">
              Together, these economic factors provide a supportive backdrop for the cryptocurrency
              sector. A buoyant economy and stable fiscal policy can inspire confidence among
              investors, potentially driving more capital into the market, including the
              ever-evolving crypto space. As these economic trends continue, the potential for
              crypto market growth is likely to strengthen further.
            </p>
            <h2 className="mb-5 text-xl font-bold">Summary</h2>
            <p className="mb-5">
              The crypto sector is shaped by policy, technology, and economics. Regulatory measures
              in Hong Kong, Japan, and London are carving unique paths. Technological innovations
              like zkSync's "Era Rocket Pool" and Optimism's "Bedrock" hard fork are pushing
              transaction efficiency and security. Economic indicators, such as the signing of the
              debt ceiling bill and positive employment reports, underscore the influence of overall
              economic health on the crypto market.
            </p>
            <p className="mb-5">
              As these elements intertwine, they reshape cryptocurrency. We'll continue monitoring
              these trends, providing clear and relevant insights into the rapidly evolving crypto
              industry. Today's changes are shaping the current state of the crypto market and
              outlining its future trajectory. Our focus remains on navigating this dynamic
              landscape with accuracy, clarity, and detail.
            </p>
            <h2 className="mb-5 text-xl font-bold">Reference</h2>
            <ul className="mb-5 list-inside list-disc">
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://cointelegraph.com/news/hong-kong-s-regulatory-lead-sets-it-up-to-be-major-crypto-hub"
                >
                  cointelegraph.com
                </a>
              </li>
              <li>
                <a className="text-blue-400 underline" href="https://coinpost.jp/?p=464453">
                  coinpost.jp
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://hk.finance.yahoo.com/news/crypto-insurer-evertas-authorized-offer-142334486.html"
                >
                  hk.finance.yahoo.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://www.coindesk.com/policy/2023/06/07/us-sec-enforcement-could-boost-europes-crypto-chances-officials-say/"
                >
                  coindesk.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://blockworks.co/news/zksync-era-rocket-pool"
                >
                  blockworks.co
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://www.newsbtc.com/news/now-that-optimism-bedrock-hard-fork-is-done-what-can-we-expect/"
                >
                  newsbtc.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://www.aljazeera.com/news/2023/6/3/biden-signs-debt-ceiling-bill-pulling-us-from-brink-of-default#:~:text=Raising%20the%20nation's%20debt%20limit,Oval%20Office%20on%20Friday%20evening"
                >
                  aljazeera.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://www.bls.gov/news.release/empsit.nr0.htm"
                >
                  bls.gov
                </a>
              </li>
            </ul>
          </div>

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

export default NewsArticle0609;
