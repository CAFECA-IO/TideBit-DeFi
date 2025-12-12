export interface IPaginatedData<T> {
  data: T;
  page: number;
  totalPages: number;
  totalCount: number; // Info: (20251212 - Julian) 總數量
  pageSize: number; // Info: (20251212 - Julian) 每頁顯示的項目數量
  hasNextPage: boolean; // Info: (20251212 - Julian) 是否有下一頁
  hasPreviousPage: boolean; // Info: (20251212 - Julian) 是否有上一頁
  sort: {
    sortBy: string; // Info: (20251212 - Julian) 排序欄位的鍵
    sortOrder: string; // Info: (20251212 - Julian) 排序欄位的值
  }[];
  note?: string; // Info: (20251212 - Julian) 用來儲存額外的資訊
}
