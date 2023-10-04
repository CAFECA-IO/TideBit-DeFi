import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {LeaderboardPage} from '../pages/LeaderboardPage';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(String(lang));
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
  await page.locator('.mt-24 > .relative > div').first().click();
  await page.locator('#personalInfoModal > div > button > span > svg').click();
  await page.locator('.mt-20 > .relative > div').first().click();
  await page.locator('#personalInfoModal > div > button > span > svg').click();
  await page.locator('.mt-28 > .relative > div').first().click();
  await page.locator('#personalInfoModal > div > button > span > svg').click();
});

test('3. 切換日、週、月排名，停留在日排名。', async ({page}) => {
  const leaderboardPage = new LeaderboardPage(page);
  await leaderboardPage.goto();
  await leaderboardPage.clickAnncmnt();
  const today = new Date();
  const dayOfWeek = new Date().getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - daysToSubtract - 8);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
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
  await page.getByRole('button', {name: i18next.t('LEADERBOARD_PAGE.DAILY')}).click();
  // cant locate the text
  await expect
    .soft(
      await page.locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.min-h-screen > div > div.inline-block.text-base > span'
      )
    )
    .toContainText(today.toISOString().slice(0, 10));
  await page.getByRole('button', {name: i18next.t('LEADERBOARD_PAGE.WEEKLY')}).click();
  await expect
    .soft(
      await page.locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.min-h-screen > div > div.inline-block.text-base> span:nth-child(1)'
      )
    )
    .toContainText(lastWeekStart.toISOString().slice(0, 10));
  await expect
    .soft(
      await page.locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.min-h-screen > div > div.inline-block.text-base > span:nth-child(2)'
      )
    )
    .toContainText(lastWeekEnd.toISOString().slice(0, 10));
  await page.getByRole('button', {name: i18next.t('LEADERBOARD_PAGE.MONTHLY')}).click();
  await expect
    .soft(
      await page.locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.min-h-screen > div > div.inline-block.text-base > span'
      )
    )
    .toContainText(monthNames[today.getMonth() - 1] + ' ' + today.getFullYear());
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
  await page.getByRole('button', {name: i18next.t('LEADERBOARD_PAGE.DAILY')}).click();
  await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.min-h-screen > div > div.pt-150px > div > div.my-10.w-screen> div.flex.w-full.flex-col.bg-darkGray7.pt-2 > div.sticky.bottom-0.z-30> div > div.flex.flex-1.items-center.space-x-2'
    )
    .click();
  await page
    .locator(
      '#personalInfoModal > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(6)'
    )
    .click();
  const pagePromise = context.waitForEvent('page');
  await page
    .locator('#BadgeModal > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(1) > svg')
    .click();
  const newPage = await pagePromise;
  await expect.soft(newPage).toHaveTitle(/Facebook/);
});
