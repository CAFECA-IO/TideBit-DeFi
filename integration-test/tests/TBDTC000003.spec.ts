import {test, expect} from '@playwright/test';
import {LandingPage} from '../pages/LandingPage';
import i18next from '../i18n';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
});

test('1. 進入 TideBit-DeFi 首頁，檢查登入狀態為未登入，切換語言為英文', async ({page}) => {
  const walletConnectButton = {name: i18next.t('NAV_BAR.WALLET_CONNECT')};
  const walletConnect = i18next.t('NAV_BAR.WALLET_CONNECT');
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await expect.soft(page.getByRole('button', walletConnectButton)).toHaveText(walletConnect);
});

test('2. 點擊導覽列的上全部按鈕', async ({page}) => {
  const tradeLink = {name: i18next.t('NAV_BAR.TRADE')};
  const leaderboardLink = {name: i18next.t('NAV_BAR.LEADERBOARD')};
  const supportLink = {name: i18next.t('NAV_BAR.SUPPORT')};
  const landingPage = new LandingPage(page);
  landingPage.goto();
  landingPage.clickAnncmnt();
  await page
    // Info (20231013 - Jacky) This test could be failed if the site version is changed
    .getByRole('link', {name: 'TideBit_logo beta v0.8.0'})
    .click();
  await expect.soft(page).toHaveTitle(/TideBit DeFi/);
  await page.getByRole('link', tradeLink).first().click();
  await expect.soft(page).toHaveURL(/.*trade/);
  landingPage.clickAnncmnt();
  await page.getByRole('link', leaderboardLink).click();
  landingPage.clickAnncmnt();
  await page.getByRole('link', supportLink).click();
  landingPage.clickAnncmnt();
  await page.locator('#globe').click();
  await page.getByRole('link', {name: '繁體中文'}).click();
  await expect.soft(page).toHaveURL(/.*tw/);
  await page.locator('#globe').click();
  await page.getByRole('link', {name: '简体中文'}).click();
  await expect.soft(page).toHaveURL(/.*cn/);
  await page.locator('#globe').click();
  await page.getByRole('link', {name: 'English'}).click();
  await expect.soft(page).toHaveTitle(/TideBit DeFi/);
  await page.getByRole('button', {name: '2 notification icon'}).click();
  await page.locator('.translate-x-0 > div > div').first().click();
  await expect
    .soft(page.getByRole('heading', {name: 'Happy Birthday to TideBit'}))
    .toHaveText('Happy Birthday to TideBit');
});

test('3. 點擊首圖上的開始和信箱聯絡按鈕、白皮書和 AI 報告按鈕下載', async ({page}) => {
  const ctaButton = {name: i18next.t('HOME_PAGE.CTA_BUTTON')};
  const whitePaperButton = {name: i18next.t('HOME_PAGE.WHITEPAPER')};
  const whitePaperLink = i18next.t('HOME_PAGE.WHITEPAPER_LINK');
  const downloadReportButton = {name: i18next.t('HOME_PAGE.DOWNLOAD_REPORT')};
  const comprehensiveIncomeStatementButton = {
    name: i18next.t('HOME_PAGE.COMPREHENSIVE_INCOME_STATEMENT'),
  };
  const balanceSheetButton = {name: i18next.t('HOME_PAGE.BALANCE_SHEET')};
  const cashFlowStatementButton = {name: i18next.t('HOME_PAGE.CASH_FLOW_STATEMENT')};
  const redFlagAnalysisButton = {name: i18next.t('HOME_PAGE.RED_FLAG_ANALYSIS')};
  const redFlagAnalysis = i18next.t('HOME_PAGE.RED_FLAG_ANALYSIS_LINK');
  const landingPage = new LandingPage(page);
  landingPage.goto();
  landingPage.clickAnncmnt();
  await expect
    .soft(page.getByRole('link', {name: 'contact@tidebit-defi.com'}))
    .toHaveAttribute('href', 'mailto:contact@tidebit-defi.com');
  await page.getByRole('button', ctaButton).click();
  await expect.soft(page).toHaveURL(/.*trade/);
  landingPage.goto();
  await expect
    .soft(page.getByRole('link', whitePaperButton))
    .toHaveAttribute('href', whitePaperLink);
  await expect
    .soft(page.getByRole('link', downloadReportButton))
    .toHaveAttribute('href', /.*balance/);
  await expect
    .soft(page.getByRole('link', comprehensiveIncomeStatementButton))
    .toHaveAttribute('href', /.*comprehensive-income/);
  await expect
    .soft(page.getByRole('link', balanceSheetButton))
    .toHaveAttribute('href', /.*balance/);
  await expect
    .soft(page.getByRole('link', cashFlowStatementButton))
    .toHaveAttribute('href', /.*cash-flow/);
  await expect
    .soft(page.getByRole('link', redFlagAnalysisButton))
    .toHaveAttribute('href', redFlagAnalysis);
});

test('4. 確認按鈕連結跳轉網頁正確。', async ({page}) => {
  const reserveRatioBlockCard = {name: i18next.t('HOME_PAGE.RESERVE_RATIO_BLOCK_CARD_2')};
  const iSunOne = {name: i18next.t('HOME_PAGE.ISUNONE_PROMOTION_DESCRIPTION')};
  const trade = {name: i18next.t('NAV_BAR.TRADE')};
  const tidebitUniversity = {name: i18next.t('NAV_BAR.TIDEBIT_UNIVERSITY')};
  const helpCenter = {name: i18next.t('NAV_BAR.HELP_CENTER')};
  const hiring = {name: i18next.t('FOOTER.HIRING')};
  const privacyPolicy = {name: i18next.t('FOOTER.PRIVACY_POLICY')};
  const landingPage = new LandingPage(page);
  landingPage.goto();
  landingPage.clickAnncmnt();
  await expect
    .soft(page.getByRole('link', reserveRatioBlockCard).nth(0))
    .toHaveAttribute('href', /.*baifa.io/);
  await expect.soft(page.getByRole('link', {name: 'BAIFA'})).toHaveAttribute('href', /.*baifa.io/);
  await expect
    .soft(page.getByRole('link', {name: 'Ethereum ETH'}))
    .toHaveAttribute('href', /.*trade\/cfd\/eth-usdt/);
  await expect
    .soft(page.getByRole('link', {name: 'Bitcoin BTC'}))
    .toHaveAttribute('href', /.*trade\/cfd\/btc-usdt/);
  await expect
    .soft(page.getByRole('link', iSunOne))
    .toHaveAttribute('href', /https:\/\/www.isun1.com*/);
  await expect
    .soft(page.getByRole('link', {name: 'app-store'}))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.getByRole('link', {name: 'google play'}))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.getByRole('link', {name: 'Facebook'}))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.getByRole('link', {name: 'instagram'}))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.getByRole('link', {name: 'twitter'}))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.getByRole('link', {name: 'reddit'}))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect
    .soft(page.getByRole('contentinfo').getByRole('link', trade))
    .toHaveAttribute('href', /.*trade/);
  await expect
    .soft(page.getByRole('link', tidebitUniversity))
    .toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.getByRole('link', helpCenter)).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.getByRole('link', hiring)).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.getByRole('link', hiring)).toHaveAttribute('href', /.*coming-soon/);
  await expect.soft(page.getByRole('link', privacyPolicy)).toHaveAttribute('href', /.*coming-soon/);
});
