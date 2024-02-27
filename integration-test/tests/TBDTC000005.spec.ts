import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {LandingPage} from '../pages/LandingPage';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
});

test('1. 進入 TideBit-DeFi 首頁，確定語言為英文，點擊錢包連接', async ({page}) => {
  const walletConnectButton = {name: i18next.t('NAV_BAR.WALLET_CONNECT')};
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.clickAnncmnt();
  await page.getByRole('button', walletConnectButton).click();
  await expect(page.getByRole('img', {name: 'MetaMask'})).toHaveAttribute('alt', 'MetaMask');
});

test('2. 至metamask切換到ETH以外的鏈上後，發送確認身份與API授權簽名請求。', async ({
  page,
  context,
}) => {
  const walletConnectButton = {name: i18next.t('NAV_BAR.WALLET_CONNECT')};
  const sendRequestButton = {name: i18next.t('WALLET_PANEL.SEND_REQUESTS_BUTTON')};
  const walletConnect = new WalletConnect(page, context);
  const errorMessage = i18next.t('WALLET_PANEL.DISABLE_SERVICE_TERM_ERROR_MESSAGE');
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.clickAnncmnt();
  await page.getByRole('button', walletConnectButton).click();
  await expect(page.getByRole('img', {name: 'MetaMask'})).toHaveAttribute('alt', 'MetaMask');
  await page.getByRole('img', {name: 'MetaMask'}).click();
  const pagePromise1 = context.newPage();
  const newPage1 = await pagePromise1;
  await newPage1.goto('chrome-extension://' + walletConnect.extensionId + '/home.html');
  if (process.env.CI) {
    await newPage1.getByRole('button', {name: 'GOT IT'}).click();
  }
  await newPage1.getByTestId('network-display').click();
  await newPage1
    .locator(
      'body > div.mm-modal > div:nth-child(3) > div > section > div.mm-box.multichain-network-list-menu > div.mm-box.multichain-network-list-item.mm-box--padding-4.mm-box--display-flex.mm-box--gap-2.mm-box--justify-content-space-between.mm-box--align-items-center.mm-box--width-full.mm-box--background-color-transparent > div.mm-box.multichain-network-list-item__network-name > button'
    )
    .click();
  await newPage1.getByRole('button', {name: 'GOT IT'}).click();
  await page.getByRole('button', sendRequestButton).click();
  await expect(
    page.locator(
      '#SignatureProcessModal > div.flex.flex-col.items-center.text-lg.leading-relaxed.text-lightWhite > div.space-y-12.flex.flex-col.pt-16.pb-4.items-start > div:nth-child(2) > div.space-y-1.text-lightWhite > div.text-sm.text-lightRed3'
    )
  ).toContainText(errorMessage);
});

test('3. 至metamask切換到ETH主鏈上，重新發送請求。', async ({page, context}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
});

test('4. 紀錄導覽列中可用餘額後，在右上角profile點擊入金後於我的資產確認。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  await walletConnect.sendRequest();
  await walletConnect.deposit();
});
