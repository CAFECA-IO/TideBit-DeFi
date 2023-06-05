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
        <div className="w-600px px-5">
          <Image src={news.img} width={600} height={100} alt="image" />
          <div className="my-8 flex justify-between">
            {' '}
            <h1 className="text-xl font-normal leading-8 tracking-wider">{news.title}</h1>
            <p className="mt-2 mr-2 text-sm text-lightGray">{date}</p>
          </div>
          {/* TODO: markdown (20230602 - Shirley) */}
          {/* <p className="text-base leading-10 tracking-normal text-lightGray1">{news.content}</p> */}

          <div className="prose mt-5 max-w-none leading-10 tracking-normal">
            <h2 className="mb-5 text-xl font-bold">Introduction</h2>
            <p className="mb-5">
              The unpredictable terrain of cryptocurrencies is experiencing a considerable degree of
              turbulence. It is looking down the barrel of an uncertain week ahead, with a potential
              downturn in its value. After an in-depth analysis of international policy shifts,
              technical market predictions, and overarching economic news, a plausible outcome could
              be{' '}
              <span className="font-bold">
                a over 5% depreciation in Ethereum's value from June 3-9, 2023.
              </span>{' '}
              In this comprehensive exploration, we will delve into these three major dimensions and
              the multifaceted factors that support them, to fully understand the composite factors
              contributing to this market prediction.
            </p>
            <h2 className="mb-5 text-xl font-bold">Global Regulatory Stance</h2>
            <p className="mb-5">
              On the international policy front, there are a couple of significant developments that
              might potentially drive down Ethereum's price.{' '}
              <span className="font-bold">
                Russia, a country that holds considerable sway in the global crypto market, is
                poised to implement new regulations on the establishment and operation of
                cryptocurrency exchanges.
              </span>{' '}
              These proposed regulations signal a stark shift in Russia's stance towards
              cryptocurrencies, casting a cloud of uncertainty over the market. Given the scale of
              Russia's involvement in the crypto market, these changes could potentially trigger
              market instability, which may, in turn, negatively affect the demand for and
              consequently the price of Ethereum. This uncertainty, coupled with a potential
              reduction in the participation of Russian players in the crypto market, forms a
              compelling case for a potential downturn in Ethereum's value.
            </p>
            <p className="mb-5">
              A similar development is occurring in Bali, Indonesia, where the government has
              initiated a crackdown on foreign tourists using cryptocurrencies for payment.{' '}
              <span className="font-bold">
                Bali, with its thriving tourism industry, forms a significant chunk of Indonesia's
                economy. If the use of cryptocurrencies like Ethereum is curtailed in such a major
                economy, it could inevitably lead to a decline in the global demand for Ethereum.
              </span>{' '}
              These restrictions could create a challenging environment for the use of
              cryptocurrencies, further exacerbating the potential decline in Ethereum's value.
              Given these shifting sands in the international policy landscape, Ethereum may well be
              set for a potentially significant decline.
            </p>
            <h2 className="mb-5 text-xl font-bold">Market Indicators</h2>
            <p className="mb-5">
              From a technical analysis standpoint, the prognosis for Ethereum isn't very optimistic
              either. Indications are that Bitcoin and Ethereum possess further correction
              potential, hinting at the possibility of a continuation of the recent downward trends.
              Given the correlation between Bitcoin and Ethereum, it stands to reason that if
              Bitcoin is likely to continue its descent, Ethereum might not be far behind. The
              market dynamics that have driven Bitcoin's recent declines could very well influence
              Ethereum's trajectory in a similar fashion.
            </p>
            <p className="mb-5">
              Ethereum's market sentiment has been depicted as negative. A negative market sentiment
              could indicate a reduced appetite for Ethereum among investors, thereby potentially
              leading to lower demand and subsequently, a decline in Ethereum's price. This
              analysis, coupled with the potential for market correction, paints a fairly bleak
              picture for Ethereum in the week ahead.
            </p>
            <h2 className="mb-5 text-xl font-bold">Economic Outlook and Trends</h2>
            <p className="mb-5">
              On the overall economic news front, several significant global developments could
              potentially contribute to a decline in Ethereum's price. The uncertainty surrounding
              the US debt ceiling and its potential impact on Bitcoin is notable. Considering that
              Ethereum often follows similar market trends to Bitcoin, this uncertainty could also
              weigh heavily on Ethereum's price. The potential for increased market volatility could
              spur risk-averse behavior among investors, leading to a reduction in the demand for
              Ethereum, thereby potentially causing a downturn in its value.
            </p>
            <p className="mb-5">
              A cautious trend for the stock market in the week ahead is observed, owing to ongoing
              geopolitical tensions and economic uncertainty. Given the correlation between
              cryptocurrency markets and traditional financial markets, this trend of caution and
              uncertainty could potentially spill over into Ethereum's market, exerting downward
              pressure on its price. The role of regulatory uncertainty and global economic
              conditions in determining cryptocurrency prices is emphasized. Given the current
              global uncertainties, it's conceivable that Ethereum might be on the brink of a
              negative price trend.
            </p>
            <p className="mb-5">
              The possible impact of the ongoing banking crisis and the US debt ceiling issue on the
              cryptocurrency market is noteworthy.
            </p>
            <p className="mb-5">
              Given that the US is a major economy, any uncertainty originating here can have a
              ripple effect across global markets. Such uncertainty could cause investors to become
              risk-averse, potentially leading to a sell-off in the cryptocurrency market, which
              could then affect Ethereum's price.
            </p>
            <h2 className="mb-5 text-xl font-bold">Summary</h2>
            <p className="mb-5">
              In conclusion, the convergence of the international policy shifts, market indicators,
              and global economic trends point towards a potential 5% downturn in Ethereum's value
              in the week ahead. The week will be largely dictated by the looming regulatory changes
              in Russia and Bali, the negative market sentiment, the potential for further market
              correction, and the wider economic uncertainties. While the cryptocurrency terrain is
              notoriously unpredictable, these factors collectively suggest a possible dip in
              Ethereum's value. In the following week, our focus will be on monitoring these events
              closely and evaluating their impacts on Ethereum's trajectory.
            </p>
            <h2 className="mb-5 text-xl font-bold">Reference</h2>
            <ul className="mb-5 list-inside list-disc">
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://iz-ru.translate.goog/1519017/mariia-kolobova/novyi-bitok-v-rossii-poiaviatsia-pravila-sozdaniia-i-raboty-kriptobirzh?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp"
                >
                  iz-ru.translate
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://www.channelnewsasia.com/asia/bali-crack-down-foreign-tourists-using-crypto-payment-3521321"
                >
                  channelnewsasia.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://coinmarketcap.com/community/articles/6476c4ef3b4ced4c1ed259d2/"
                >
                  coinmarketcap.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://forkast.news/weekly-market-wrap-bitcoin-weighed-down-debt-ceiling-uncertainty/"
                >
                  forkast.news
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://www.fxstreet.com/cryptocurrencies/news/bitcoin-and-ethereum-have-further-correction-potential-202305250851"
                >
                  fxstreet.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://app.intotheblock.com/coin/ETH?pid=fxstreet&utm_source=fxstreet_widget"
                >
                  intotheblock.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://edition.cnn.com/2023/05/28/business/stocks-week-ahead/index.html"
                >
                  edition.cnn.com
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 underline"
                  href="https://cointelegraph.com/news/bank-crisis-debt-ceiling-powder-keg-bitmex-arthur-hayes"
                >
                  cointelegraph.com
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

export default NewsArticle;
