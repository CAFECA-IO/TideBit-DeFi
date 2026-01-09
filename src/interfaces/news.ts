// Info: (20251212 - Julian) 用於 news item 列表
export interface INewsBrief {
  id: string;
  title: string;
  imageId: string | null;
  excerpt: string; // Info: (20251212 - Julian) 內文摘要
  publicTimestamp: number; // Info: (20251212 - Julian) 發佈時間戳
  viewCount: number; // Info: (20251212 - Julian) 閱讀次數
  shareCount: number; // Info: (20251212 - Julian) 分享次數
}

// Info: (20251212 - Julian) 用於 news detail 頁面
export interface INewsDetail extends INewsBrief {
  content: string; // Info: (20251212 - Julian) 內文，Markdown 格式
}

export const mockNews: INewsBrief[] = [
  {
    id: 'news1',
    title:
      'The SAS interface is down, input the cross-platform capacitor so we can quantify the CSS panel!',
    imageId: null,
    excerpt:
      "Thank you for joining TideBit De-Fi! We're excited to have you here. Welcome to the CryptoWave Exchange! Your participation means a lot to us.",
    publicTimestamp: 1732396800,
    viewCount: 1200,
    shareCount: 300,
  },
  {
    id: 'news2',
    title: 'Revolutionizing Finance: How DeFi is Transforming the Financial Landscape',
    imageId: null,
    excerpt:
      'Decentralized Finance (DeFi) is rapidly changing the way we think about money and financial services. By leveraging blockchain technology, DeFi platforms offer a more inclusive, transparent, and efficient alternative to traditional banking systems.',
    publicTimestamp: 1732483200,
    viewCount: 950,
    shareCount: 150,
  },
  {
    id: 'news3',
    title: 'Understanding Smart Contracts: The Backbone of DeFi',
    imageId: null,
    excerpt:
      'Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They play a crucial role in DeFi by enabling trustless transactions and automating complex financial processes.',
    publicTimestamp: 1732569600,
    viewCount: 800,
    shareCount: 100,
  },
];
