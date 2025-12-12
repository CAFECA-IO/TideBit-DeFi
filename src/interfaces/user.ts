// Info: (20251212 - Julian) 用於 Sidebar 的 User overview 資訊
interface IUserOverview {
  userAvatarUrl: string | null; // Info: (20251212 - Julian) 用戶頭貼 URL
  userName: string; // Info: (20251212 - Julian) 用戶名稱
  balanceInTwd: number; // Info: (20251212 - Julian) 用戶餘額 (TWD)
  balanceInIsc: number; // Info: (20251212 - Julian) 用戶餘額 (ISC)
}
