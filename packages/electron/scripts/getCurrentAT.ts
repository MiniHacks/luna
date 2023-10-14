import { getActivePage, getBrowser } from "../lib/browser/attachToBrowser";
import { getParseableUI } from "../lib/browser/parseUI";

const main = async () => {
  const browser = await getBrowser();

  const page = await getActivePage(browser);

  if (!page) {
    console.error(
      "No active page -- make sure that the page is currently in focus"
    );
    return;
  }

  const aTree = await getParseableUI(page);
  console.log(aTree);
};

main().then(() => process.exit(0));
