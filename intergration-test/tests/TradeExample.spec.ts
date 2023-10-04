import { test, expect } from "../fixtures";
import i18next from "../i18n";
import { WalletConnect } from "../pages/WalletConnect";
import { TradePage } from "../pages/TradePage";

// change to correspond i18n
test.beforeEach(async ({ context, page }) => {
  const lang = await page.evaluate("window.navigator.language;");
  i18next.changeLanguage(String(lang));
});

test("Trade example", async ({ page, context }) => {
    //new a walletConnect instance
    const walletConnect = new WalletConnect(page, context);
    // the following 4 lines are for connecting metamask
    await walletConnect.getMetamaskId();
    await walletConnect.connectMetamask();
    await walletConnect.connectWallet();
    await walletConnect.sendRequest();
    //new a tradePage instance
    const tradePage = new TradePage(page, context);
    // go to ETH trade page
    await tradePage.goto();
    await tradePage.clickAnncmnt();
    // can change input amount, default value is 0.05
    await tradePage.inputAmount();
    // open long position
    await tradePage.openLongPosition(walletConnect.extensionId);
    // go to BTC trade page
    await tradePage.gotoBTC();
    await tradePage.clickAnncmnt();
    await tradePage.inputAmount("0.001");
    // open short position
    await tradePage.openShortPosition(walletConnect.extensionId);
    // update position default value is 1 means the last position
    await tradePage.updatePosition(walletConnect.extensionId);
    //close position default value is 1 means the last position
    await tradePage.closePosition(walletConnect.extensionId);
  });