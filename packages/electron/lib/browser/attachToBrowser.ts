import axios from "axios";
import puppeteer, { Browser, Page } from "puppeteer-core";
import { CHROME_DEBUGGING_PORT } from "../config";

export const getWSUrl = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://127.0.0.1:${CHROME_DEBUGGING_PORT}/json/version`)
      .then(async (response) => {
        // await bringBrowserToFront();
        resolve(response.data.webSocketDebuggerUrl);
      })
      .catch(async () => {
        // open chrome with the cli command
        // eslint-disable-next-line no-console
        console.error("chrome not in debug mode");
        reject(new Error("chrome not in debug mode"));
        // killAndStartBrowser(profile)
        //   .then(async () => {
        //     await sleep(1000);
        //     resolve(await getWSUrl(profile));
        //   })
        //   .catch(reject);
      });
  });
};

export const getBrowser = async (): Promise<Browser> => {
  const wsUrl = await getWSUrl();

  return puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null,
  });
};

export async function getActivePage(
  browser: Browser
): Promise<Page | undefined> {
  const allPages = await browser.pages();
  // eslint-disable-next-line no-console
  // console.log(allPages);
  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];
    // eslint-disable-next-line no-await-in-loop
    const state = await page.evaluate(() => document.visibilityState);
    if (state === "visible") {
      return page;
    }
  }
  return undefined;
}
