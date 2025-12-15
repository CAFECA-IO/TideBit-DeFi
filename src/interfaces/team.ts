// Info: (20251212 - Julian) 用於 Team item 列表
export interface ITeamBrief {
  id: string;
  teamImageId: string | null;
  taxId: string; // Info: (20251212 - Julian) 公司統編
  status: 'Pending' | 'Approved'; // Info: (20251212 - Julian) Team 狀態，須確認是否有其他狀態
  systemNotification?: string; // Info: (20251212 - Julian) 系統通知訊息，如 "We’ve received your application..."
  role: 'Can Edit' | 'Can View' | 'Admin'; // Info: (20251212 - Julian) Team 權限，Can Edit、Can View (Collaborating) 和 Admin (Created by me)
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: 'Admin' | 'Can Edit' | 'Can View';
  }[]; // Info: (20251212 - Julian) Team 成員
}

export interface IFundingList {
  id: string;
  fundingTitle: string;
}

// Info: (20251212 - Julian) 用於 Team detail 頁面
export interface ITeamDetail extends ITeamBrief {
  description: string; // Info: (20251212 - Julian) Team 描述
  publishedFundingAmount: number; // Info: (20251212 - Julian) 已發佈募資總額
  onGoingFundingList: IFundingList[]; // Info: (20251212 - Julian) 進行中的募資列表
  upGoingFundingList: IFundingList[]; // Info: (20251212 - Julian) 即將開始的募資列表
  closedFundingList: IFundingList[]; // Info: (20251212 - Julian) 已結束的募資列表
}

// Info: (20251212 - Julian) ============ form UI interfaces ============
// Info: (20251212 - Julian) 用於 Create team info 表單 UI
export interface ITeamCreateInfo {
  tokenName: string;
  tokenLogoId: string;
}

// Info: (20251212 - Julian) 用於 Team basic info 表單 UI
export interface ITeamBasicInfo {
  legalCompanyName: string;
  companyRegisteredLocation: string;
  keyCompanyRepresentativeName: string;
  keyContactPerson?: string;
  contactNumber: string;
  emailAddress: string;
}

// Info: (20251212 - Julian) 用於 Team registration info 表單 UI
export interface ITeamRegistrationInfo {
  legalStructure: 'Company Limited by Shares'; // Info: (20251212 - Julian) 可能有其他選項，待確認
  businessRegistrationNumber: string;
  RegistrationTimestamp: number; // Info: (20251212 - Julian) 公司註冊時間戳
  industry: string; // Info: (20251212 - Julian) 應該會有固定選項，待確認
}

// Info: (20251212 - Julian) 用於 Team upload document UI
export interface ITeamDocument {
  keyCompanyRepresentativeIdType: 'Passport' | 'National ID' | 'Driving License'; // Info: (20251212 - Julian) 關鍵代表人的身份證件類型
  pictureOfKeyCompanyRepresentativePassport: string; // Info: (20251212 - Julian) 身份證件圖片 ID
  pictureOfBusinessRegistrationCertificate: string; // Info: (20251212 - Julian) 商業登記證圖片 ID
  pictureOfTaxStatusCertification: string; // Info: (20251212 - Julian) 稅務狀況證明圖片 ID
}
