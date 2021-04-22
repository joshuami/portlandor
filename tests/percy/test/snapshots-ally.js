const percySnapshot = require("@percy/puppeteer");
const puppeteer = require("puppeteer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const SITE_NAME = process.env.SITE_NAME;
const HOME_PAGE = SITE_NAME
  ? `https://${SITE_NAME}-portlandor.pantheonsite.io`
  : "https://portlandor.lndo.site";
const ARTIFACTS_FOLDER = SITE_NAME ? `/home/circleci/artifacts/` : `./`;
const timeout = 60000 * 2;

var browser, page, login_url;
beforeAll(async () => {
  browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox"],
    // Uncomment these lines to watch test locally
    headless: false,
    slowMo: 100,
    defaultViewport: null,
  });
  page = await browser.newPage();
  await page.setDefaultTimeout(timeout);

  if (process.env.CIRCLECI) {
    // On CI, the CI script will call terminus to retrieve login URL
    login_url = process.env.ALLY_LOGIN;
    await page.goto(login_url);
    await percySnapshot(page, "Ally Admin - Account profile");
  } else {
    var drush_uli_result = await exec(
      "lando drush uli --mail ally.admin@portlandoregon.gov"
    );
    expect(drush_uli_result.stdout).toEqual(expect.stringContaining("http"));
    login_url = drush_uli_result.stdout.replace(
      "http://default",
      "https://portlandor.lndo.site"
    );
    // Log in once for all tests to save time
    await page.goto(login_url);
  }
}, timeout);

afterAll(async () => {
  await browser.close();
}, timeout * 20);

describe("Ally Admin user test", () => {
  it("The site is in good status", async function () {
    await page.goto(`${HOME_PAGE}/my-groups`);
    await percySnapshot(page, "Ally - My groups");
  });

  // it("Add Marty to POWR group", async function () {
  //   await page.goto(
  //     `${HOME_PAGE}/powr/content/add/group_membership?destination=/powr/members`
  //   );
  //   await page.type("#edit-entity-id-0-target-id", "Marty Member");
  //   await page.click("#edit-group-roles-project-editor");
  // });

  it("Remove Marty from POWR group", async function () {
    await page.goto(`${HOME_PAGE}/powr/members`);
    const rows = document.querySelectorAll("tr");
    console.log(result[1][2]);
    // await page.click(element);
    // await page.click("#edit-submit");
    // await page.goto(`${HOME_PAGE}/powr/members`);
  });
  timeout;
});
//table/tbody/tr[15]/td[1]/a
