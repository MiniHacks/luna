import { getActivePage, getBrowser } from "../lib/browser/attachToBrowser";
import { createMessageFromPageContent } from "../lib/browser/parseUI";

const main = async () => {
  const browser = await getBrowser();

  const page = await getActivePage(browser);

  if (!page) {
    console.error(
      "No active page -- make sure that the page is currently in focus"
    );
    return;
  }

  console.log(
    `Steps done: x:y, a:b. ${JSON.stringify(
      await createMessageFromPageContent(page)
    )}`
  );
};

main().then(() => process.exit(0));
