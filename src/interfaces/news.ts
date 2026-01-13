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

export const mockNews: INewsDetail[] = [
  {
    id: 'news1',
    title:
      'The SAS interface is down, input the cross-platform capacitor so we can quantify the CSS panel!',
    imageId: null,
    excerpt:
      "Thank you for joining TideBit De-Fi! We're excited to have you here. Welcome to the CryptoWave Exchange! Your participation means a lot to us.",
    content: `
   # Welcome to TideBit De-Fi!
   We're excited to have you here. Your participation means a lot to us.
   ## Getting Started
   To get started, make sure to explore our platform and take advantage of the various features we offer.
   ### Features
   - Secure Transactions
   - User-Friendly Interface
   - 24/7 Customer Support
   #### Join the Community
   Connect with other users and stay updated with the latest news and updates.
   Visit our [website](https://www.tidebit.com) for more information.
   `,
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
    content: `### Key Features of DeFi
1. Accessibility: DeFi platforms are open to anyone with an internet connection, removing barriers to entry.
2. Transparency: All transactions are recorded on a public ledger, ensuring accountability.
3. Efficiency: Automated processes reduce the need for intermediaries, lowering costs and speeding up transactions.

### Popular DeFi Applications
- Decentralized Exchanges (DEXs)
- Lending and Borrowing Platforms
- Stablecoins

| Benefits of DeFi | Traditional Finance |
|-----------------|--------------------|
| Open to all     | Restricted access  |
| Transparent     | Opaque processes   |
| Cost-effective  | High fees          |

### Future of DeFi
As DeFi continues to evolve, we can expect to see further innovation and adoption, potentially reshaping the global financial system.
> Disclaimer: This article is for informational purposes only and does not constitute financial advice. Please conduct your own research before engaging in DeFi activities.

[Learn more](https://github.com/CAFECA-IO)`,
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
    content: `Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They play a crucial role in DeFi by enabling trustless transactions and automating complex financial processes.
## How Smart Contracts Work
Smart contracts operate on blockchain networks, where they automatically execute actions when predefined conditions are met. This eliminates the need for intermediaries, reducing costs and increasing efficiency.
### Applications of Smart Contracts in DeFi
- Automated Market Makers (AMMs)
- Lending and Borrowing Protocols
- Yield Farming
#### Challenges and Considerations
While smart contracts offer numerous benefits, they also come with challenges such as security vulnerabilities and regulatory concerns. It is essential to conduct thorough audits and stay informed about the evolving legal landscape.
![Smart Contract Diagram](https://example.com/smart-contract-diagram.png)
`,
    publicTimestamp: 1732569600,
    viewCount: 800,
    shareCount: 100,
  },
];
