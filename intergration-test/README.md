# Introduction

This is the  end to end test for [TideBit-Defi](https://tidebit-defi.com/). To see the detail of the testcases, please refer to [TBD Testcases](https://github.com/CAFECA-IO/Documents/tree/main/TBD/testcases).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18.0.0)

### Dependencies

- Playwright
- Browser
- i18next

### Installation

1. Clone this repository

    ```bash
    git clone https://github.com/CAFECA-IO/TideBit-DeFi.git
    ```

2. Checkout to the develop branch

    ```bash
    git checkout develop
    ```

3. Change directory to the repository

    ```bash
    cd intergration
    ```

4. Install dependencies

    ```node.js
    npm install
    ```

5. Install Playwright Browsers

    ```node.js
    npx playwright install --with-deps chromium
    ```

6. Install Metamask 11.0.0

   ```bash
   wget https://github.com/MetaMask/metamask-extension/releases/download/v11.0.0/metamask-chrome-11.0.0.zip && unzip metamask-chrome-11.0.0.zip -d metamask-chrome-11.0.0 && rm -rf metamask-chrome-11.0.0.zip
   ```

### Run the test

- (Optional) Change the baseUrl to local Url

    1. open the file in the path: intergration-test/playwright.config.ts
    2. change the below '<https://tidebit-defi.com/>' to your local Url

    ```typescript
    const baseURL = process.env.CI ? `${process.env.BASE_URL}` : 'https://tidebit-defi.com/';
    ```

- Run Playwright tests to run all the test in tests folder

    ```node.js
    npx playwright test
    ```

- Run Playwright tests to run single test file in tests folder
  
   ```node.js
   npx playwright test tests/{filename}  --retries=1
    ```

- Run the test with the specific title in tests folder

    ```node.js
    npx playwright test -g "{Test Title}"  --retries=1
    ```

### See the test report

- show the test report

    ```node.js
    npx playwright show-report
    ```

### Read the test report on Github Action

1. Download the test report from github action.
2. Put the report in the folder which is installed the playwright.
3. Run the following command to show the report.

    ```node.js
    npx playwright show-report {articaft name}
    ```

- Reference: [Playwright CI GitHub Actions](https://playwright.dev/docs/ci-intro#html-report)

### Costomize the trade test with your own wallet

1. Change the Mnemonic Phrase and password in .auth/metamask.json
2. Create a test file in tests folder named with "*.spec.ts"
3. Example of trade case

```typescript
import { test, expect } from "../fixtures";
import i18next from "../i18n";
import { WalletConnect } from "../pages/WalletConnect";
import { TradePage } from "../pages/TradePage";

// change to correspond i18n
test.beforeEach(async ({ context, page }) => {
  const lang = await page.evaluate("window.navigator.language;");
  i18next.changeLanguage(String(lang));
});

test("Trade example", async ({ page, extensionId, context }) => {
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
    await tradePage.inputAmount("0.01");
    // open short position
    await tradePage.openShortPosition(walletConnect.extensionId);
    // update position default value is 1 means the last position
    await tradePage.updatePosition(walletConnect.extensionId);
    //close position default value is 1 means the last position
    await tradePage.closePosition(walletConnect.extensionId);
  });
```
