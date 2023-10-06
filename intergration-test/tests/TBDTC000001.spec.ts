import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {LandingPage} from '../pages/LandingPage';
import {TradePage} from '../pages/TradePage';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(String(lang));
});

test('1. 進入 TideBit-DeFi 首頁，確認網站為英文後，將錢包連接到網站上，完成登入。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.clickAnncmnt();
  const navAvailable = await page
    .locator(
      '#__next > div > div:nth-child(17) > nav > div > div > div.flex.items-center > div > div > div:nth-child(6) > div > div:nth-child(1) > div:nth-child(2)'
    )
    .textContent();
  const navAvailableNum = Number(navAvailable.substring(0, navAvailable.length - 4));
  if (navAvailableNum < 100) {
    walletConnect.deposit();
  }
});

test('2. 進入「交易」頁面，點擊左上方ETH後，點擊ETH上的星星移除我的最愛，點擊我的最愛查看後重新添加，再點擊BTC。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const tradePage = new TradePage(page, context);
  await tradePage.goto();
  await tradePage.clickAnncmnt();
  await page.getByRole('button', {name: 'ETH'}).click();
  await page
    .locator(
      '#tickerSelectorModal > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(3) > div > div > div:nth-child(3) > button'
    )
    .click();
  await page
    .getByRole('button', {name: i18next.t('TRADE_PAGE.TICKER_SELECTOR_TAB_FAVORITE')})
    .click();
  await expect
    .soft(
      page.locator(
        '#tickerSelectorModal > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(3)'
      )
    )
    .toContainText('BTC');
  await page.getByRole('button', {name: i18next.t('TRADE_PAGE.TICKER_SELECTOR_TAB_ALL')}).click();
  await page
    .locator(
      '#tickerSelectorModal > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(3) > div > div > div:nth-child(3) > button'
    )
    .click();
  await page
    .locator(
      '#tickerSelectorModal > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(3)'
    )
    .click();
  await expect(page).toHaveURL(/.*btc-usdt/);
});

test('3. 至ETH交易頁面，下滑點擊白皮書與官方網站。', async ({page, context}) => {
  const tradePage = new TradePage(page, context);
  await tradePage.goto();
  await expect
    .soft(page.getByRole('link', {name: i18next.t('TRADE_PAGE.CRYPTO_SUMMARY_WHITEPAPER')}))
    .toHaveAttribute('href', /.*whitepaper/);
  await expect
    .soft(page.getByRole('link', {name: i18next.t('TRADE_PAGE.CRYPTO_SUMMARY_WEBSITE')}))
    .toHaveAttribute('href', /https:\/\/ethereum.org/);
});

test('4. 點擊任一篇ETH新聞後，下滑至最下面點擊分享至FB', async ({page, context}) => {
  const tradePage = new TradePage(page, context);
  await tradePage.goto();
  await tradePage.clickAnncmnt();
  await page
    .locator('#__next > div > main > div > div > div:nth-child(5) > div > section:nth-child(3)')
    .click();
  await expect.soft(page).toHaveURL(/.*\/news\/.*/);
  await tradePage.clickAnncmnt();
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('img', {name: 'FACEBOOK', exact: true}).click();
  const newPage = await pagePromise;
  await expect.soft(newPage).toHaveTitle(/Facebook/);
});
test('5. 回到「交易」頁面後，在「看漲」和「看跌」各開一個0.05ETH的倉位，並到「倉位」的 tab確認', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const tradePage = new TradePage(page, context);
  await tradePage.goto();
  await tradePage.clickAnncmnt();
  await tradePage.inputAmount();
  await tradePage.openLongPosition(walletConnect.extensionId);
  await tradePage.inputAmount();
  await tradePage.openShortPosition(walletConnect.extensionId);
  // await page.getByRole('button', {name: i18next.t('TRADE_PAGE.POSITION_TAB')}).click();
  // await expect
  //   .soft(
  //     page.locator(
  //       '#__next > div > main > div > div.pointer-events-none.fixed.right-0.top-82px.z-10.flex.overflow-x-hidden.overflow-y-hidden.outline-none > div > div > div > div > div:nth-child(1) > div.relative.my-2.min-h-140px > div.mt-2.flex.justify-between > div.inline-flex.items-center.text-sm > div'
  //     )
  //   )
  //   .toContainText('Up');
  // await expect
  //   .soft(
  //     page.locator(
  //       '#__next > div > main > div > div.pointer-events-none.fixed.right-0.top-82px.z-10.flex.overflow-x-hidden.overflow-y-hidden.outline-none > div > div > div > div > div:nth-child(1) > div.relative.my-2.min-h-140px > div.mt-2.flex.justify-between > div.inline-flex.items-center.text-sm > div'
  //     )
  //   )
  //   .toContainText('Down');
});
test('6. 點擊其中一個持倉，設定止盈點與止損點後，點擊更新持倉。', async ({page, context}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const tradePage = new TradePage(page, context);
  await tradePage.goto();
  await tradePage.clickAnncmnt();
  await tradePage.updatePosition(walletConnect.extensionId);
});
test('7. 點擊倒數計時的圈圈，將持倉關閉，並查看「歷史紀錄」中的詳細記錄。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  const tradePage = new TradePage(page, context);
  await tradePage.goto();
  await tradePage.clickAnncmnt();
  await tradePage.closePosition(walletConnect.extensionId);
  await tradePage.closePosition(walletConnect.extensionId);
  await page.getByRole('button', {name: i18next.t('TRADE_PAGE.POSITION_TAB_HISTORY')}).click();
  const minutetext = await page
    .locator(
      '#__next > div > main > div > div.pointer-events-none.fixed.right-0.top-82px.z-10.flex.overflow-x-hidden.overflow-y-hidden.outline-none > div > div > div > div > div:nth-child(1) > div.mt-3.text-xs > div > div.w-48px > div:nth-child(2)'
    )
    .textContent();
  const minute = Number(minutetext.substring(3));
  if (new Date().getUTCMinutes() > 0) {
    expect(new Date().getUTCMinutes() - minute).toBeGreaterThanOrEqual(0);
    expect(new Date().getUTCMinutes() - minute).toBeLessThanOrEqual(2);
  } else {
    expect(new Date().getUTCMinutes() - minute).toBeLessThanOrEqual(0);
  }
});
