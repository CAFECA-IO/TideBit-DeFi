import {test, expect} from '../fixtures';
import i18next from '../i18n';
import {WalletConnect} from '../pages/WalletConnect';
import {LandingPage} from '../pages/LandingPage';

test.beforeEach(async ({page}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
});

test('1. 進入 TideBit-DeFi 首頁，確定語言為英文，點擊錢包連接', async ({page}) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.clickAnncmnt();
  await page.locator('#NavWalletButtonDesktop').click();
  await expect(page.getByRole('img', {name: 'MetaMask'})).toHaveAttribute('alt', 'MetaMask');
});

test('2. 至metamask切換到ETH以外的鏈上後，發送確認身份與API授權簽名請求。', async ({
  page,
  context,
}) => {
  const walletConnect = new WalletConnect(page, context);
  const errorMessage = i18next.t('WALLET_PANEL.DISABLE_SERVICE_TERM_ERROR_MESSAGE');
  await walletConnect.getMetamaskId();
  await walletConnect.connectMetamask();
  await walletConnect.connectWallet();
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.clickAnncmnt();
  await page.locator('#NavWalletButtonDesktop').click();
  await expect(page.getByRole('img', {name: 'MetaMask'})).toHaveAttribute('alt', 'MetaMask');
  await page.locator('#MetaMaskButton').click();
  const pagePromise1 = context.newPage();
  const newPage1 = await pagePromise1;
  await newPage1.goto('chrome-extension://' + walletConnect.extensionId + '/home.html');
  // Info (20240229 - Jacky) This loop only needed in CI, not in local
  await newPage1.getByTestId('network-display').isVisible();
  while ((await newPage1.getByTestId('popover-close').count()) > 0) {
    await newPage1.getByTestId('popover-close').click();
  }
  await newPage1.getByTestId('network-display').click();
  await newPage1.getByTestId('Linea Mainnet').click();
  await newPage1.getByRole('button', {name: 'GOT IT'}).click();
  await expect(newPage1.getByLabel('Network Menu Linea Mainnet')).toBeVisible();
  await page.locator('#SendRequestButton').click();
  await expect(newPage1.getByLabel('Network Menu Ethereum Mainnet')).toBeVisible();
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
