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
