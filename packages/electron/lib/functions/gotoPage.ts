import { Page } from "puppeteer-core";

export const gotoPage = {
  name: "gotoPage",
  description: "Go to a given page",
  parameters: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The URL of the page to go to",
      },
    },
    required: ["url"],
  },
};

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
