// Info: (20251212 - Julian) 用於 FAQ item
export interface IFaq {
  id: string;
  question: string;
  answer: string;
}

// Info: (20251212 - Julian) 用於 Announcement item
export interface IAnnouncementBrief {
  id: string;
  title: string;
  imageId: string | null;
  excerpt: string; // Info: (20251212 - Julian) 內文摘要
  createdAt: number;
}

// Info: (20251212 - Julian) 用於 Terms and Agreements UI
export interface ITermsAndAgreements {
  idAgreement: string; // Info: (20251212 - Julian) 條款與協議 ID，Markdown 格式
  fundingAgreement: string; // Info: (20251212 - Julian) 募資協議，Markdown 格式
  shareholdingAgreement: string; // Info: (20251212 - Julian) 股東協議，Markdown 格式
  termsOfService: string; // Info: (20251212 - Julian) 服務條款，Markdown 格式
  privacyTerms: string; // Info: (20251212 - Julian) 隱私條款，Markdown 格式
}

// Info: (20251212 - Julian) 用於 General Setting UI
export interface IGeneralSetting {
  userAvatarUrl: string | null;
  userName: string;
  isNewMessageNotificationEnabled: boolean;
  isSystemAnnouncementNotificationEnabled: boolean;
  language: 'English' | 'Traditional Chinese';
  theme: 'Light' | 'Dark' | 'System Default';
}

// Info: (20251212 - Julian) ============ form UI interfaces ============
// Info: (20251212 - Julian) 用於 Report a problem 表單
export interface IReportForm {
  issueType: 'General Inquiry'; // Info: (20251212 - Julian) 可能有其他選項，待確認
  subject: string;
  description: string;
}
