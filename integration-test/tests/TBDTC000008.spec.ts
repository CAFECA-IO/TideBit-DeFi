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
  await myAssetsPage.checkBalance();
  const headerPNL = await page
    .locator(
      '#__next > div > div:nth-child(17) > div.w-full.text-center > nav > div > div > div.flex.items-center > div > div > div > div:nth-child(3) > div.whitespace-nowrap.text-sm > span'
    )
    .textContent();
  const myAssetsPNL = await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(2) > section > div.mx-auto > div > div:nth-child(3) > div > h2'
    )
    .textContent();
  await expect
    .soft(myAssetsPNL.replace(',', ''))
    .toContain(headerPNL.replace(',', '').replace(/ /g, ''));
  await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(1) > button'
    )
    .click();
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
  await page.waitForTimeout(15000);
  await expect
    .soft(
      page.locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div:nth-child(2) > div > div > div > div:nth-child(1)'
      )
    )
    .toContainText(String(todayDate));
  // Todo (20231013 - Jacky) This expect should be finished after existing a button show all logs.
  // await expect
  //   .soft(
  //     page.locator(
  //       '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div:nth-child(2) > div > div > div > div:nth-last-child(1)'
  //     )
  //   )
  //   .toContainText(String(todayDate - 7));
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
  await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center > div > div.mt-2.hidden.items-center.space-x-2 > div:nth-child(1) > button'
    )
    .click();
  await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.mt-2.hidden.items-center.space-x-2 > div.relative.flex.h-48px.flex-col.items-start.justify-center.transition-all.duration-200.ease-in-out.bg-darkGray8 > div > div:nth-child(3)'
    )
    .getByText('01')
    .click();
  const firstLogDate = await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div:nth-child(2) > div > div > div > div:nth-child(1)'
    )
    .textContent();
  const lastLogdate = await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div:nth-child(2) > div > div > div > div:nth-last-child(1)'
    )
    .textContent();
  expect(Number(firstLogDate.substring(0, 2))).toBeGreaterThanOrEqual(Number(todayDate));
  expect(Number(lastLogdate.substring(0, 2))).toBeGreaterThanOrEqual(1);
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
  await page.getByRole('button', titleButton).click();
  await page
    .locator(
      '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(2)'
    )
    .click();
  await page.getByRole('button', depositButton).nth(3).click();
  await expect(page.locator('#depositHistoryModal')).toBeVisible();
});

test('7. 點選交易類型切換至關倉並點選第一筆紀錄的關倉按鈕後，點擊分享至FB，再關閉紀錄。', async ({
  page,
  context,
}) => {
  const closeButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_CLOSE_BUTTON')};
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const myAssetsPage = new MyAssetsPage(page);
  await myAssetsPage.goto();
  await page.getByRole('button', closeButton).first().click();
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('img', {name: 'FACEBOOK'}).first().click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  await expect.soft(newPage).toHaveURL(/facebook.com/);
  await expect.soft(newPage).toHaveTitle(/Facebook/);
});
