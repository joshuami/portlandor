const percySnapshot = require('@percy/puppeteer')
const puppeteer = require('puppeteer')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const SITE_NAME = process.env.SITE_NAME;
const HOME_PAGE = (SITE_NAME) ? `https://${SITE_NAME}-portlandor.pantheonsite.io` : 'https://portlandor.lndo.site';
const ARTIFACTS_FOLDER = (SITE_NAME) ? `/home/circleci/artifacts/` : `./`;
const timeout = 60000 * 2;

var browser, page, login_url;
beforeAll(async () => {
  browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox'],
    // Uncomment these lines to watch test locally
    // headless: false,
    // slowMo: 100,
    // defaultViewport: null,
  })
  page = await browser.newPage()
  await page.setDefaultTimeout(timeout)

  if (process.env.CIRCLECI) {
    // On CI, the CI script will call terminus to retrieve login URL
    login_url = process.env.SUPERADMIN_LOGIN_2;
    await page.goto(login_url);
    await page.screenshot({
      path: `${ARTIFACTS_FOLDER}admin-profile.jpg`,
      type: "jpeg",
      fullPage: true
    });
  }
  else {
    var drush_uli_result = await exec('lando drush uli');
    login_url = drush_uli_result.stdout.replace('http://default', 'https://portlandor.lndo.site');
    // Log in once for all tests to save time
    await page.goto(login_url);
  }

  // Print browser version
  await page.browser().version().then(function(version) {
    console.log(version);
    });
  // console.log(browser.process().spawnfile);

}, timeout)

afterAll(async () => {
  await browser.close()
}, timeout * 20)

describe('SuperAdmin user test', () => {
  it(
    'superAdmin manages group',
    async function () {
      try {
        let text_content = '', selector='';

        // If a previous test failed without deleting the test group, delete it first
        await page.goto(`${HOME_PAGE}/percy-test-group/delete`);
        // await page.$eval('#edit-submit', elem => elem.click());
        text_content = await page.evaluate(() => document.querySelector('.page-title').textContent);
        if(text_content.indexOf('Percy Test Group') > 0) {
          selector = 'input#edit-submit';
          await page.focus(selector)
          await page.evaluate((selector) => document.querySelector(selector).click(), selector);
          await page.waitForNavigation();
        }

        // Create the test group
        await page.goto(`${HOME_PAGE}/group/add/bureau_office`);
        text_content = await page.evaluate(() => document.querySelector('.page-title').textContent);
        expect(text_content).toEqual(expect.stringContaining('Add Bureau/office'));
        await page.type('#edit-label-0-value', 'Percy Test Group');
        await page.type('#edit-field-official-organization-name-0-value', 'Official name of Percy test group');
        await page.select('#edit-field-migration-status', 'Complete')
        await page.type('#edit-field-summary-0-value', 'This is a test summary for the Percy Test group');
        // Must expand the admin fields group in order to input Group Path
        await page.click('details#edit-group-administrative-fields');
        await page.type('#edit-field-group-path-0-value', 'percy-test-group');

        selector = '#edit-submit';
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);
        await page.waitForNavigation();

        await percySnapshot(page, 'Site Admin - Group created');
        text_content = await page.evaluate(() => document.querySelector('h1.page-title').textContent);
        expect(text_content).toEqual(expect.stringContaining('Percy Test Group'));

        // Add Ally Admin as a group admin to the test group
        await page.goto(`${HOME_PAGE}/percy-test-group/members`);
        text_content = await page.evaluate(() => document.querySelector('.button-action').textContent);
        expect(text_content).toEqual('Add member');
        selector = '.button-action';
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);
        await page.waitForNavigation();

        text_content = await page.evaluate(() => document.querySelector('.page-title').textContent);
        expect(text_content).toEqual(expect.stringContaining('Add Bureau/office: Group membership'));
        await page.type('#edit-entity-id-0-target-id', 'Ally Admin (62)');
        selector = '#edit-group-roles-bureau-office-admin';
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);
        // Submit form
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        text_content = await page.evaluate(() => document.querySelector('td.views-field-name').textContent);
        expect(text_content).toEqual(expect.stringContaining('Ally Admin'));

        // Delete the new group
        await page.goto(`${HOME_PAGE}/percy-test-group/delete`);
        selector = 'input#edit-submit';
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);
        await page.waitForNavigation();

        text_content = await page.evaluate(() => document.querySelector('div.messages--status').textContent);
        expect(text_content).toEqual(expect.stringContaining('has been deleted'));
      } catch (e) {
        // Capture the screenshot when test fails and re-throw the exception
        await page.screenshot({
          path: `${ARTIFACTS_FOLDER}manage-group-error.jpg`,
          type: "jpeg",
          fullPage: true
        });
        throw e;
      }
    },
    timeout * 5
  );
});