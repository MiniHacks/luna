import { Page } from "puppeteer-core";
import gotoPageJSON from "@luna/model/functions/gotoPage.json";

export const gotoPage = gotoPageJSON;

type GotoPageArgs = {
  url: string;
};

export const gotoPageImplementation = async (
  args: GotoPageArgs,
  page: Page
): Promise<void> => {
  let { url } = args;

  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }
  await page.goto(url);
};
