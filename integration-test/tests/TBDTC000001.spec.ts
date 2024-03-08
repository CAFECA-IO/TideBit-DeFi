import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {LandingPage} from '../pages/LandingPage';
import {TradePage} from '../pages/TradePage';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
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
      '#__next > div > div.fixed.inset-x-0.top-0.z-40.bg-black > nav > div > div > div.flex.items-center > div > div > div > div.flex.justify-between.w-full.space-x-3.flex-1 > div:nth-child(1) > p'
    )
    .textContent();
  const navAvailableNum = (navAvailable as string).substring(
    0,
    (navAvailable as string).length - 4
  );
  // Info: (20231013 - Jacky) make sure navAvailable is bigger than 100
  if (Number(navAvailableNum) < 100) {
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
  await page.locator('#TickerSelectorDesktop').click();
  await page.locator('#FavoriteTab').click();
  await page.locator('#StarETH').click();
  await page.locator('#AllTab').click();
  await page.locator('#FavoriteTab').click();
  await expect.soft(page.locator('#CryptoCardETH')).toBeHidden();
  await page.locator('#CryptoCardBTC').click();
  await expect(page).toHaveURL(/.*btc-usdt/);
});

test('3. 至ETH交易頁面，下滑點擊白皮書與官方網站。', async ({page, context}) => {
  // Bug: (20240227 - Jacky) This URL should be fixed after the hidden chart issue is fixed.
  const tradePage = new TradePage(page, context);
  // await tradePage.goto();
  await page.goto('https://tidebit-defi.com/en/trade/cfd/eth-usdt');
  await tradePage.clickAnncmnt();
  await expect.soft(page.locator('#CryptoWhitePaperLink')).toHaveAttribute('href', /.*whitepaper/);
  await expect
    .soft(page.locator('#CryptoWebsiteLink'))
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
  await page.locator('#ShareNewsToFACEBOOK').click();
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
  await page.locator('#PositionTabButton').click();
  await page
    .locator(
      '#__next > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-last-child(1) '
    )
    .click();
  await page.locator('#UpdateFormCloseButton').click();
  const lastPositionMinuteText = await page
    .locator(
      '#__next > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-last-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(2)'
    )
    .textContent();
  const NextTolastPositionMinuteText = await page
    .locator(
      '#__next > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-last-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(2)'
    )
    .textContent();
  const lastPositionMinute = Number(lastPositionMinuteText.substring(3, 5));
  const NextTolastPositionMinute = Number(NextTolastPositionMinuteText.substring(3, 5));
  if (new Date().getUTCMinutes() > 0) {
    expect(new Date().getUTCMinutes() - lastPositionMinute).toBeGreaterThanOrEqual(0);
    expect(new Date().getUTCMinutes() - lastPositionMinute).toBeLessThanOrEqual(2);
    expect(new Date().getUTCMinutes() - NextTolastPositionMinute).toBeGreaterThanOrEqual(0);
    expect(new Date().getUTCMinutes() - NextTolastPositionMinute).toBeLessThanOrEqual(2);
  } else {
    expect(new Date().getUTCMinutes() - lastPositionMinute).toBeLessThanOrEqual(0);
    expect(new Date().getUTCMinutes() - NextTolastPositionMinute).toBeLessThanOrEqual(0);
  }
});

// Info (20231013 - Jacky) This test still fails by invalid ethereum address for no reason
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

// Info (20231013 - Jacky) This test should pass after the efficiency improvement of CFD trade
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
  await page.locator('#HistoryTabButton').click();
  const minuteText = await page
    .locator(
      '#__next > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div:nth-child(1) > div > div.w-48px > div:nth-child(2)'
    )
    .textContent();
  const minute = Number(minuteText.substring(3));
  if (new Date().getUTCMinutes() > 0) {
    expect(new Date().getUTCMinutes() - minute).toBeGreaterThanOrEqual(0);
    expect(new Date().getUTCMinutes() - minute).toBeLessThanOrEqual(2);
  } else {
    expect(new Date().getUTCMinutes() - minute).toBeLessThanOrEqual(0);
  }
});
