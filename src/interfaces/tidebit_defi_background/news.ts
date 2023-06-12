import {ICurrency} from '../../constants/currency';

export interface IRecommendedNews {
  newsId: string;
  img: string;
  timestamp: number;
  title: string;
  description: string;
}

export interface INews {
  newsId: string;
  img: string;
  timestamp: number;
  title: string;
  content: string;
}

export const dummyRecommendationNews: IRecommendedNews[] = [
  {
    newsId: 'news-eth-20230531001',
    img: '/news/rectangle_767-5@2x.png',
    timestamp: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230601001',
    img: '/news/rectangle_767-6@2x.png',
    timestamp: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230602001',
    img: '/news/rectangle_767-7@2x.png',
    timestamp: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230602002',
    img: '/news/rectangle_767-8@2x.png',
    timestamp: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },

  {
    newsId: 'news-eth-20230602003',
    img: '/news/rectangle_767-4@2x.png',
    timestamp: 1685673712,
    title: 'Add news title here',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
  },
];

export const dummyNews: INews = {
  newsId: 'news-eth-20230602003',
  img: '/news/rectangle_809@2x.png',
  timestamp: 1685673712,
  title: 'Add news title here',
  content:
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunta over 5% depreciation elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,',
};

export const getDummyNews = (currency: ICurrency) => {
  return dummyNews;
};

export const getDummyRecommendationNews = (currency: ICurrency) => {
  const recommendationNews = generateDummyData(10);
  return recommendationNews;
};

function generateDummyData(length: number) {
  const cryptoBriefNews = [];

  for (let i = 0; i < length; i++) {
    const imgName =
      i > 8
        ? `/news/rectangle_767-2`
        : i === 0
        ? `/news/rectangle_767`
        : `/news/rectangle_767-${i}`;

    const data = {
      newsId: 'news-eth-20230602' + i,
      timestamp: 1685496317,
      title: 'Add news title here - ' + i,
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea',
      img: imgName + '@2x.png',
    };

    cryptoBriefNews.push(data);
  }

  return cryptoBriefNews;
}

export const dummyRecommendedNewsList = generateDummyData(100);

export const tempRecommendedNewsArray: IRecommendedNews[] = [
  {
    newsId: 'news-eth-20230602001',
    img: '/news/news-eth-20230602001@2x.png',
    timestamp: 1685673712,
    title: `Upcoming Week Brings Uncertainty for Ethereum's Price`,
    description: ` The unpredictable terrain of cryptocurrencies is experiencing a considerable degree of turbulence. It is looking down the barrel of an uncertain week ahead, with a potential downturn in its value. After an in-depth analysis of international policy shifts, technical market predictions, and overarching economic news, a plausible outcome could be a over 5% depreciation in Ethereum's value from June 3-9, 2023.
  `,
  },
  {
    newsId: 'news-eth-20230609001',
    img: '/news/news-eth-20230609001@2x.png',
    timestamp: 1686254536,
    title: `The Shape of Crypto: Policy, Tech, and Economic Trends Sculpting the Future`,
    description: `The dynamism of the global financial landscape, particularly the crypto market, is marked by the interplay of policies, technology, and economics. We'll focus on these aspects, playing pivotal roles in sculpting the future of cryptocurrency. Further, our analysis suggests a potential 3% increase in the Ethereum price from June 10-16, 2023.
  `,
  },
];

export const tempNews: INews = {
  newsId: 'news-eth-20230602001',
  img: '/news/news-eth-20230602001@2x.png',
  timestamp: 1685673712,
  title: `Upcoming Week Brings Uncertainty for Ethereum's Price`,
  content: `
  ### Introduction

  The unpredictable terrain of cryptocurrencies is experiencing a considerable degree of turbulence. It is looking down the barrel of an uncertain week ahead, with a potential downturn in its value. After an in-depth analysis of international policy shifts, technical market predictions, and overarching economic news, a plausible outcome could be a over 5% depreciation in Ethereum's value from June 3-9, 2023. In this comprehensive exploration, we will delve into these three major dimensions and the multifaceted factors that support them, to fully understand the composite factors contributing to this market prediction.
  
  ### Global Regulatory Stance
  
  On the international policy front, there are a couple of significant developments that might potentially drive down Ethereum's price. Russia, a country that holds considerable sway in the global crypto market, is poised to implement new regulations on the establishment and operation of cryptocurrency exchanges. These proposed regulations signal a stark shift in Russia's stance towards cryptocurrencies, casting a cloud of uncertainty over the market. Given the scale of Russia's involvement in the crypto market, these changes could potentially trigger market instability, which may, in turn, negatively affect the demand for and consequently the price of Ethereum. This uncertainty, coupled with a potential reduction in the participation of Russian players in the crypto market, forms a compelling case for a potential downturn in Ethereum's value.
  
  A similar development is occurring in Bali, Indonesia, where the government has initiated a crackdown on foreign tourists using cryptocurrencies for payment. Bali, with its thriving tourism industry, forms a significant chunk of Indonesia's economy. If the use of cryptocurrencies like Ethereum is curtailed in such a major economy, it could inevitably lead to a decline in the global demand for Ethereum. These restrictions could create a challenging environment for the use of cryptocurrencies, further exacerbating the potential decline in Ethereum's value. Given these shifting sands in the international policy landscape, Ethereum may well be set for a potentially significant decline.
  
  ### Market Indicators
  
  From a technical analysis standpoint, the prognosis for Ethereum isn't very optimistic either. Indications are that Bitcoin and Ethereum possess further correction potential, hinting at the possibility of a continuation of the recent downward trends. Given the correlation between Bitcoin and Ethereum, it stands to reason that if Bitcoin is likely to continue its descent, Ethereum might not be far behind. The market dynamics that have driven Bitcoin's recent declines could very well influence Ethereum’s trajectory in a similar fashion.
  
  Ethereum’s market sentiment has been depicted as negative. A negative market sentiment could indicate a reduced appetite for Ethereum among investors, thereby potentially leading to lower demand and subsequently, a decline in Ethereum's price. This analysis, coupled with the potential for market correction, paints a fairly bleak picture for Ethereum in the week ahead.
  
  ### Economic Outlook and Trends
  
  On the overall economic news front, several significant global developments could potentially contribute to a decline in Ethereum's price. The uncertainty surrounding the US debt ceiling and its potential impact on Bitcoin is notable. Considering that Ethereum often follows similar market trends to Bitcoin, this uncertainty could also weigh heavily on Ethereum’s price. The potential for increased market volatility could spur risk-averse behavior among investors, leading to a reduction in the demand for Ethereum, thereby potentially causing a downturn in its value.
  
  A cautious trend for the stock market in the week ahead is observed, owing to ongoing geopolitical tensions and economic uncertainty. Given the correlation between cryptocurrency markets and traditional financial markets, this trend of caution and uncertainty could potentially spill over into Ethereum's market, exerting downward pressure on its price. The role of regulatory uncertainty and global economic conditions in determining cryptocurrency prices is emphasized. Given the current global uncertainties, it's conceivable that Ethereum might be on the brink of a negative price trend.
  
  The possible impact of the ongoing banking crisis and the US debt ceiling issue on the cryptocurrency market is noteworthy.
  
  Given that the US is a major economy, any uncertainty originating here can have a ripple effect across global markets. Such uncertainty could cause investors to become risk-averse, potentially leading to a sell-off in the cryptocurrency market, which could then affect Ethereum's price.
  
  ### Summary
  
  In conclusion, the convergence of the international policy shifts, market indicators, and global economic trends point towards a potential 5% downturn in Ethereum's value in the week ahead. The week will be largely dictated by the looming regulatory changes in Russia and Bali, the negative market sentiment, the potential for further market correction, and the wider economic uncertainties. While the cryptocurrency terrain is notoriously unpredictable, these factors collectively suggest a possible dip in Ethereum's value. In the following week, our focus will be on monitoring these events closely and evaluating their impacts on Ethereum's trajectory.
  
  ### Reference
  
  - https://iz-ru.translate.goog/1519017/mariia-kolobova/novyi-bitok-v-rossii-poiaviatsia-pravila-sozdaniia-i-raboty-kriptobirzh?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp
  - https://www.channelnewsasia.com/asia/bali-crack-down-foreign-tourists-using-crypto-payment-3521321
  - https://coinmarketcap.com/community/articles/6476c4ef3b4ced4c1ed259d2/
  - https://forkast.news/weekly-market-wrap-bitcoin-weighed-down-debt-ceiling-uncertainty/
  - https://www.fxstreet.com/cryptocurrencies/news/bitcoin-and-ethereum-have-further-correction-potential-202305250851
  - https://app.intotheblock.com/coin/ETH?pid=fxstreet&utm_source=fxstreet_widget
  - https://edition.cnn.com/2023/05/28/business/stocks-week-ahead/index.html
  - https://cointelegraph.com/news/bank-crisis-debt-ceiling-powder-keg-bitmex-arthur-hayes`,
};

export const tempNewsArray: INews[] = [
  {
    newsId: 'news-eth-20230602001',
    img: '/news/news-eth-20230602001@2x.png',
    timestamp: 1685673712,
    title: `Upcoming Week Brings Uncertainty for Ethereum's Price`,
    content: `
  \n### Introduction

  The unpredictable terrain of cryptocurrencies is experiencing a considerable degree of turbulence. It is looking down the barrel of an uncertain week ahead, with a potential downturn in its value. After an in-depth analysis of international policy shifts, technical market predictions, and overarching economic news, a plausible outcome could be a over 5% depreciation in Ethereum's value from June 3-9, 2023. In this comprehensive exploration, we will delve into these three major dimensions and the multifaceted factors that support them, to fully understand the composite factors contributing to this market prediction.
  
  \n### Global Regulatory Stance
  
  On the international policy front, there are a couple of significant developments that might potentially drive down Ethereum's price. Russia, a country that holds considerable sway in the global crypto market, is poised to implement new regulations on the establishment and operation of cryptocurrency exchanges. These proposed regulations signal a stark shift in Russia's stance towards cryptocurrencies, casting a cloud of uncertainty over the market. Given the scale of Russia's involvement in the crypto market, these changes could potentially trigger market instability, which may, in turn, negatively affect the demand for and consequently the price of Ethereum. This uncertainty, coupled with a potential reduction in the participation of Russian players in the crypto market, forms a compelling case for a potential downturn in Ethereum's value.
  
  A similar development is occurring in Bali, Indonesia, where the government has initiated a crackdown on foreign tourists using cryptocurrencies for payment. Bali, with its thriving tourism industry, forms a significant chunk of Indonesia's economy. If the use of cryptocurrencies like Ethereum is curtailed in such a major economy, it could inevitably lead to a decline in the global demand for Ethereum. These restrictions could create a challenging environment for the use of cryptocurrencies, further exacerbating the potential decline in Ethereum's value. Given these shifting sands in the international policy landscape, Ethereum may well be set for a potentially significant decline.
  
  \n### Market Indicators
  
  From a technical analysis standpoint, the prognosis for Ethereum isn't very optimistic either. Indications are that Bitcoin and Ethereum possess further correction potential, hinting at the possibility of a continuation of the recent downward trends. Given the correlation between Bitcoin and Ethereum, it stands to reason that if Bitcoin is likely to continue its descent, Ethereum might not be far behind. The market dynamics that have driven Bitcoin's recent declines could very well influence Ethereum’s trajectory in a similar fashion.
  
  Ethereum’s market sentiment has been depicted as negative. A negative market sentiment could indicate a reduced appetite for Ethereum among investors, thereby potentially leading to lower demand and subsequently, a decline in Ethereum's price. This analysis, coupled with the potential for market correction, paints a fairly bleak picture for Ethereum in the week ahead.
  
  \n### Economic Outlook and Trends
  
  On the overall economic news front, several significant global developments could potentially contribute to a decline in Ethereum's price. The uncertainty surrounding the US debt ceiling and its potential impact on Bitcoin is notable. Considering that Ethereum often follows similar market trends to Bitcoin, this uncertainty could also weigh heavily on Ethereum’s price. The potential for increased market volatility could spur risk-averse behavior among investors, leading to a reduction in the demand for Ethereum, thereby potentially causing a downturn in its value.
  
  A cautious trend for the stock market in the week ahead is observed, owing to ongoing geopolitical tensions and economic uncertainty. Given the correlation between cryptocurrency markets and traditional financial markets, this trend of caution and uncertainty could potentially spill over into Ethereum's market, exerting downward pressure on its price. The role of regulatory uncertainty and global economic conditions in determining cryptocurrency prices is emphasized. Given the current global uncertainties, it's conceivable that Ethereum might be on the brink of a negative price trend.
  
  The possible impact of the ongoing banking crisis and the US debt ceiling issue on the cryptocurrency market is noteworthy.
  
  Given that the US is a major economy, any uncertainty originating here can have a ripple effect across global markets. Such uncertainty could cause investors to become risk-averse, potentially leading to a sell-off in the cryptocurrency market, which could then affect Ethereum's price.
  
  \n### Summary
  
  In conclusion, the convergence of the international policy shifts, market indicators, and global economic trends point towards a potential 5% downturn in Ethereum's value in the week ahead. The week will be largely dictated by the looming regulatory changes in Russia and Bali, the negative market sentiment, the potential for further market correction, and the wider economic uncertainties. While the cryptocurrency terrain is notoriously unpredictable, these factors collectively suggest a possible dip in Ethereum's value. In the following week, our focus will be on monitoring these events closely and evaluating their impacts on Ethereum's trajectory.
  
  \n### Reference
  
  - https://iz-ru.translate.goog/1519017/mariia-kolobova/novyi-bitok-v-rossii-poiaviatsia-pravila-sozdaniia-i-raboty-kriptobirzh?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp
  - https://www.channelnewsasia.com/asia/bali-crack-down-foreign-tourists-using-crypto-payment-3521321
  - https://coinmarketcap.com/community/articles/6476c4ef3b4ced4c1ed259d2/
  - https://forkast.news/weekly-market-wrap-bitcoin-weighed-down-debt-ceiling-uncertainty/
  - https://www.fxstreet.com/cryptocurrencies/news/bitcoin-and-ethereum-have-further-correction-potential-202305250851
  - https://app.intotheblock.com/coin/ETH?pid=fxstreet&utm_source=fxstreet_widget
  - https://edition.cnn.com/2023/05/28/business/stocks-week-ahead/index.html
  - https://cointelegraph.com/news/bank-crisis-debt-ceiling-powder-keg-bitmex-arthur-hayes`,
  },
  {
    newsId: 'news-eth-20230609001',
    img: '/news/news-eth-20230609001@2x.png',
    timestamp: 1686254536,
    title: `The Shape of Crypto: Policy, Tech, and Economic Trends Sculpting the Future`,
    content: `
  
  \n### Introduction

The dynamism of the global financial landscape, particularly the crypto market, is marked by the interplay of policies, technology, and economics. We'll focus on these aspects, playing pivotal roles in sculpting the future of cryptocurrency. Further, our analysis suggests a potential 3% increase in the Ethereum price from June 10-16, 2023.

### International Policy

Hong Kong is becoming a major crypto hub due to its strategic regulatory moves. Hong Kong's distinct approach to regulation, including recognition of crypto assets under existing laws and the requirement for all crypto firms to be licensed, is fostering a conducive environment for crypto growth.

Japan's policies, leveraging its tech strength, have made strides in the crypto sector. Japan's introduction of the Payment Services Act, which recognizes crypto as a legal form of payment, has boosted the country's crypto growth. Meanwhile, Japan's regulatory body, the Financial Services Agency, has created a regulatory sandbox for fintech innovation, thereby nurturing a favorable environment.

London's regulatory environment is also fueling its crypto market. Evertas, a London-based crypto insurer, was granted authorization to offer services, suggesting London's flexible regulatory stance. 

Moreover, European officials believe US SEC's intensified enforcement could create opportunities for Europe, including the UK, to attract more crypto-related businesses.

### Technological advancements

In the realm of technological advancements, there’s some progression happening in zkSync and Optimism.

zkSync, a Layer-2 scaling solution, is pioneering efficiency and scalability in blockchain transactions. Its notable development, the "Era Rocket Pool," uses zero-knowledge proofs to achieve significant transaction speed and reduce gas costs. This step represents a critical breakthrough, as the technology resolves two of the most pressing concerns in blockchain applications: scalability and high transaction fees. The innovation promises to revolutionize not just the DeFi sector but the entire cryptocurrency landscape, by allowing for more participants and transactions at a lower cost.

Optimism is another trailblazer in this field. The company's recently completed "Bedrock" hard fork, introduces a new era in transaction speed and security. The hard fork involves an upgraded Ethereum Layer-2 scaling solution, designed to handle more transactions while increasing their security. This advancement is especially crucial in the context of the growing demand for secure and efficient crypto transactions. The "Bedrock" hard fork underscores the progress being made in the realm of blockchain technology and lays the foundation for further advancements in transactional speed and security in the crypto world.

### Economic Outlook and Trends

US President Biden's recent signing of the debt ceiling bill, averts a default crisis, ensuring economic stability. Coupled with the BLS's latest employment report indicating job growth, these factors are fostering a healthy investment environment.

Moreover, the Bureau of Labor Statistics (BLS) released a promising employment report. It shows encouraging signs of job growth, a key indicator of a healthy and recovering economy. The positive economic news suggests a robust job market, increased consumer spending, and overall economic growth, conditions typically associated with a thriving investment ecosystem.

Together, these economic factors provide a supportive backdrop for the cryptocurrency sector. A buoyant economy and stable fiscal policy can inspire confidence among investors, potentially driving more capital into the market, including the ever-evolving crypto space. As these economic trends continue, the potential for crypto market growth is likely to strengthen further.

### Summary

The crypto sector is shaped by policy, technology, and economics. Regulatory measures in Hong Kong, Japan, and London are carving unique paths. Technological innovations like zkSync's "Era Rocket Pool" and Optimism's "Bedrock" hard fork are pushing transaction efficiency and security. Economic indicators, such as the signing of the debt ceiling bill and positive employment reports, underscore the influence of overall economic health on the crypto market.

As these elements intertwine, they reshape cryptocurrency. We'll continue monitoring these trends, providing clear and relevant insights into the rapidly evolving crypto industry. Today's changes are shaping the current state of the crypto market and outlining its future trajectory. Our focus remains on navigating this dynamic landscape with accuracy, clarity, and detail.

### Reference

\n- https://cointelegraph.com/news/hong-kong-s-regulatory-lead-sets-it-up-to-be-major-crypto-hub
\n- https://coinpost.jp/?p=464453
\n- https://hk.finance.yahoo.com/news/crypto-insurer-evertas-authorized-offer-142334486.html
\n- https://www.coindesk.com/policy/2023/06/07/us-sec-enforcement-could-boost-europes-crypto-chances-officials-say/
\n- https://blockworks.co/news/zksync-era-rocket-pool
\n- https://www.newsbtc.com/news/now-that-optimism-bedrock-hard-fork-is-done-what-can-we-expect/
\n- [https://www.aljazeera.com/news/2023/6/3/biden-signs-debt-ceiling-bill-pulling-us-from-brink-of-default#:~:text=Raising the nation's debt limit,Oval Office on Friday evening](https://www.aljazeera.com/news/2023/6/3/biden-signs-debt-ceiling-bill-pulling-us-from-brink-of-default#:~:text=Raising%20the%20nation's%20debt%20limit,Oval%20Office%20on%20Friday%20evening)
\n- https://www.bls.gov/news.release/empsit.nr0.htm
`,
  },
];

export const getNewsById = (newsId: string): INews | undefined => {
  const newsItem = tempNewsArray.find(item => item.newsId === newsId);
  if (newsItem) {
    return newsItem;
  } else {
    return undefined;
  }
};

export const getRecommendatedNewsById = (newsId: string): IRecommendedNews[] => {
  const news = tempRecommendedNewsArray.filter(news => news.newsId !== newsId);
  return news;
};

export const getBriefNewsById = (newsId: string): IRecommendedNews => {
  const news = tempRecommendedNewsArray.filter(news => news.newsId === newsId)[0];
  return news;
};
