import {test, expect} from '../fixtures';
import metamask from '../.auth/metamask.json';
import i18next from '../i18n';

test('Connect Metamask', async ({page, context}) => {
  const lang = await page.evaluate('window.navigator.language;');
  i18next.changeLanguage(lang as string);
  await page.goto('chrome://extensions/');
  await page.locator('#devMode').click();
  const extensionId = (await page.locator('#extension-id').textContent()).substring(3).trim();
  await page.goto('chrome-extension://' + extensionId + '/home.html');
  await page.locator('#onboarding__terms-checkbox').click();
  await expect
    .soft(
      page.locator(
        '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > ul > li:nth-child(3) > button'
      )
    )
    .toHaveText('Import an existing wallet');
  await page
    .locator(
      '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > ul > li:nth-child(3) > button'
    )
    .click();
  await page.getByRole('button', {name: 'I agree'}).click();
  for (let i = 0; i < 12; i++) {
    await page.locator('#import-srp__srp-word-' + i).fill(metamask['srp-word'][i]);
  }
  await page.getByRole('button', {name: 'Confirm Secret Recovery Phrase'}).click();
  await page.getByTestId('create-password-new').fill(metamask['new-password']);
  await page.getByTestId('create-password-confirm').fill(metamask['new-password']);
  await page.getByTestId('create-password-terms').click();
  await page.getByRole('button', {name: 'Import My wallet'}).click();
  await page.getByRole('button', {name: 'Got it'}).click();
  await page.getByTestId('pin-extension-next').click();
  await page.getByTestId('pin-extension-done').click();
  await page.getByTestId('popover-close').click();
  await page.goto('./');
  page.getByRole('button', {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON') as string}).click();
  const pagePromise1 = context.newPage();
  await page.getByRole('button', {name: i18next.t('NAV_BAR.WALLET_CONNECT') as string}).click();
  await page
    .locator('div')
    .filter({hasText: /^MetaMask$/})
    .nth(1)
    .click();
  const newPage1 = await pagePromise1;
  await newPage1.goto('chrome-extension://' + extensionId + '/popup.html');
  await newPage1.getByTestId('page-container-footer-next').click();
  await newPage1.getByTestId('page-container-footer-next').click();
  const pagePromise2 = context.newPage();
  await page
    .getByRole('button', {
      name: i18next.t('WALLET_PANEL.SEND_REQUESTS_BUTTON') as string,
    })
    .click();
  const newPage2 = await pagePromise2;
  await newPage2.goto('chrome-extension://' + extensionId + '/popup.html');
  await newPage2.getByTestId('signature-request-scroll-button').click();
  await newPage2.getByTestId('page-container-footer-next').click();
  await page.getByRole('button', {name: i18next.t('WALLET_PANEL.DONE_BUTTON') as string}).click();
});
