import {test, expect} from '@playwright/test';
import {LandingPage} from '../pages/LandingPage';
import i18next from '../i18n';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
});

test('1. 進入 TideBit-DeFi 首頁，檢查登入狀態為未登入，切換語言為英文', async ({page}) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await expect.soft(page.locator('#NavWalletButtonDesktop')).toBeVisible();
});

test('2. 點擊導覽列的上全部按鈕', async ({page}) => {
  const landingPage = new LandingPage(page);
  landingPage.goto();
  landingPage.clickAnncmnt();
  await page.locator('#NavLogoDesktop').click();
  await expect.soft(page).toHaveTitle(/TideBit DeFi/);
  await page.locator('#NavTradeDesktop').click();
  await expect.soft(page).toHaveURL(/.*trade/);
  landingPage.clickAnncmnt();
  await page.locator('#NavLeaderboardDesktop').click();
  await expect.soft(page).toHaveURL(/.*leaderboard/);
  landingPage.clickAnncmnt();
  await page.locator('#NavSupportDesktop').click();
  landingPage.clickAnncmnt();
  await page.locator('#globe').click();
  await page.locator('#ENButtonDesktop').click();
  await expect.soft(page).toHaveURL(/.*en/);
  await page.locator('#globe').click();
  await page.locator('#CNButtonDesktop').click();
  await expect.soft(page).toHaveURL(/.*cn/);
  await page.locator('#globe').click();
  await page.locator('#TWButtonDesktop').click();
  await expect.soft(page).toHaveTitle(/TideBit DeFi/);
  await page.locator('#NavBellDesktop').click();
  await page.getByRole('heading', {name: 'Happy Birthday to TideBit'}).first().click();
  await expect
    .soft(page.getByRole('heading', {name: 'Happy Birthday to TideBit'}).first())
    .toHaveText('Happy Birthday to TideBit');
});

test('3. 點擊首圖上的開始和信箱聯絡按鈕、白皮書和 AI 報告按鈕下載', async ({page}) => {
  const whitePaperLink = i18next.t('HOME_PAGE.WHITEPAPER_LINK');
  const landingPage = new LandingPage(page);
  landingPage.goto();
  landingPage.clickAnncmnt();
  await expect
    .soft(page.locator('#ContactEmailButton'))
    .toHaveAttribute('href', 'mailto:contact@tidebit-defi.com');
  await page.locator('#StartTradingButton').click();
  await expect.soft(page).toHaveURL(/.*trade/);
  landingPage.goto();
  await expect.soft(page.locator('#WhitepaperLink')).toHaveAttribute('href', whitePaperLink);
  await expect.soft(page.locator('#DownloadReportButton')).toHaveAttribute('href', /.*balance/);
  await expect
    .soft(page.locator('#IncomeStatementDownload'))
    .toHaveAttribute('href', /.*comprehensive-income/);
  await expect.soft(page.locator('#BalanceSheetDownload')).toHaveAttribute('href', /.*balance/);
  await expect
    .soft(page.locator('#CashFlowStatementDownload'))
    .toHaveAttribute('href', /.*cash-flow/);
  await expect.soft(page.locator('#RedFlagAnalysisDownload')).toHaveAttribute('href', /.*baifa.io/);
});

test('4. 確認按鈕連結跳轉網頁正確。', async ({page}) => {
  const landingPage = new LandingPage(page);
  landingPage.goto();
  landingPage.clickAnncmnt();
  await expect.soft(page.locator('#USDTReserveRatioLink')).toHaveAttribute('href', /.*baifa.io/);
  await expect.soft(page.locator('#PoweredByLink')).toHaveAttribute('href', /.*baifa.io/);
  await expect
    .soft(page.locator('#CryptoCategory > div > div:nth-child(2) > div > div:nth-child(1) > a'))
    .toHaveAttribute('href', /.*trade\/cfd\/eth-usdt/);
  await expect
    .soft(page.locator('#CryptoCategory > div > div:nth-child(2) > div > div:nth-child(2) > a'))
    .toHaveAttribute('href', /.*trade\/cfd\/btc-usdt/);
  await expect.soft(page.locator('#AppStoreLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#GooglePlayLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterFacebookLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterInstagramLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterTwitterLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterRedditLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterTradeLink')).toHaveAttribute('href', /.*trade/);
  await expect.soft(page.locator('#FooterUniversityLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterHelpCenterLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.locator('#FooterHiringLink')).toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.locator('#FooterServicePolicyLink'))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.locator('#FooterPrivacyPolicyLink'))
    .toHaveAttribute('href', /.*coming-soon/);
});
