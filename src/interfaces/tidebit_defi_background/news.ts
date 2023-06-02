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
  // TODO: /news/rectangle_809@2x.png
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
