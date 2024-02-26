import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {LeaderboardPage} from '../pages/LeaderboardPage';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
});

test('1. 進入 TideBit-DeFi 首頁，將錢包連接到網站上，完成登入。', async ({page, context}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
});

test('2. 點擊前三名查看用戶資料後關閉。', async ({page}) => {
  const leaderboardPage = new LeaderboardPage(page);
  await leaderboardPage.goto();
  await leaderboardPage.clickAnncmnt();
  await page.locator('#Ranking1').click();
  await page.locator('#AchievementModalCloseButton').click();
  await page.locator('#Ranking2').click();
  await page.locator('#AchievementModalCloseButton').click();
});

// Info: (20240226 - Jacky) pass only on asia/taipei timezone will fail on UTC timezone
test('3. 切換日、週、月排名，停留在日排名。', async ({page}) => {
  const leaderboardPage = new LeaderboardPage(page);
  await leaderboardPage.goto();
  await leaderboardPage.clickAnncmnt();
  const today = new Date();
  const dayOfWeek = new Date().getUTCDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getUTCDate() - daysToSubtract - 8);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getUTCDate() + 7);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  await expect.soft(await page.locator('#LiveRemainingTime')).toBeVisible();
  await page.locator('#DailyTab').click();
  // cant locate the text
  await expect
    .soft(await page.locator('#DailyTimePeriod > span'))
    .toContainText(today.toISOString().slice(0, 10));
  await page.locator('#WeeklyTab').click();
  await expect
    .soft(await page.locator('#WeeklyTimePeriod > span:nth-child(1)'))
    .toContainText(lastWeekStart.toISOString().slice(0, 10));
  await expect
    .soft(await page.locator('#WeeklyTimePeriod > span:nth-child(2)'))
    .toContainText(lastWeekEnd.toISOString().slice(0, 10));
  await page.locator('#MonthlyTab').click();
  await expect
    .soft(await page.locator('#MonthlyTimePeriod > span'))
    .toContainText(monthNames[today.getUTCMonth() - 1] + ' ' + today.getFullYear());
});

test('4. 點擊此帳號的地址後點擊入金徽章並將徽章分享至FB。', async ({page, context}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const leaderboardPage = new LeaderboardPage(page);
  await leaderboardPage.goto();
  await leaderboardPage.clickAnncmnt();
  await page.locator('#DailyTab').click();
  await page.locator('#UserPersonalRanking').click();
  await page.locator('#BadgeDeposit').click();
  const pagePromise = context.waitForEvent('page');
  await page.locator('#ShareBadgeToFacebook').click();
  const newPage = await pagePromise;
  await expect.soft(newPage).toHaveTitle(/Facebook/);
});
