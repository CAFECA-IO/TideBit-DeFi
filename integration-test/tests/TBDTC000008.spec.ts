import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {MyAssetsPage} from '../pages/MyAssetsPage';

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
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  await myAssetsPage.checkBalance();
});

test('2. 點擊右上角profile的icon，再點擊我的資產，點擊總餘額上的眼睛與入金按鈕。', async ({
  page,
  context,
}) => {
  const maxButton = {name: i18next.t('D_W_MODAL.MAX')};
  const max = i18next.t('D_W_MODAL.MAX');
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  await page.locator('#TotalBalanceShowButton').click();
  const headerPNL = await page
    .locator(
      '#__next > div > div:nth-child(6) > div.fixed.inset-x-0.top-0.z-40.bg-black > nav > div > div > div.flex.items-center > div > div > div > div.flex.justify-between.w-full.space-x-3.flex-1 > div:nth-child(1) > p'
    )
    .textContent();
  const myAssetsPNL = await page
    .locator(
      '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)'
    )
    .textContent();
  await expect.soft(headerPNL as string).toContain(myAssetsPNL as string);
  await page.locator('#MyAssetsDeposit').click();
  await expect(page.getByRole('button', maxButton)).toContainText(max);
});

test('3. 若缺乏從入金 ➡️ 建倉 ➡️ 更新持倉 ➡️ 關倉 ➡️ 出金的完整交易紀錄，則先完成上述流程，否則跳到下一步。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  await myAssetsPage.checkTradeLog();
});

// Todo (20231013 - Jacky) This expect should be passed after improving log loading time
test('4. 查看現有交易紀錄與日期區間', async ({page, context}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  const todayDate = new Date().getUTCDate();
  const logDate = await page
    .locator(
      '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div.w-70px > div > p'
    )
    .textContent();
  expect.soft(logDate).toContain(String(todayDate));
});

test('5. 設定日期區間篩選交易紀錄', async ({page, context}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  const todayDate = new Date().getUTCDate();
  await page.locator('#DateStartPicker').click();
  await page.locator('#DateStartPicker01').click();
  const firstLogDate = await page
    .locator(
      '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div:nth-last-child(1) > div > div.w-70px > div > p'
    )
    .textContent();
  const lastLogDate = await page
    .locator(
      '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div.w-70px > div > p'
    )
    .textContent();
  expect(Number(lastLogDate)).toBeLessThanOrEqual(Number(todayDate));
  expect(Number(firstLogDate)).toBeGreaterThanOrEqual(1);
});
test('6. 點選交易類型切換至入金並點選第一筆紀錄的入金按鈕，再關閉紀錄。', async ({
  page,
  context,
}) => {
  const titleButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')};
  const depositButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')};
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  await page.locator('#TradingTypeMenuButton').click();
  await page.locator('#TypeDepositButton').click();
  await page
    .locator(
      '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > button'
    )
    .click();
  await expect.soft(page.locator('#DWHistoryModal')).toBeVisible();
  await page.locator('#HistoryCloseButton').click();
});

test('7. 點選交易類型切換至關倉並點選第一筆紀錄的關倉按鈕後，點擊分享至FB，再關閉紀錄。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  await page.locator('#TradingTypeMenuButton').click();
  await page.locator('#TypeCloseButton').click();
  await page
    .locator(
      '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > button'
    )
    .click();
  const pagePromise = context.waitForEvent('page');
  await page.locator('#ShareHistoryToFACEBOOK').click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  await expect.soft(newPage).toHaveURL(/facebook.com/);
  await expect.soft(newPage).toHaveTitle(/Facebook/);
});
