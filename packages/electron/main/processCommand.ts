import { ChatCompletionRequestMessage } from "openai";
import { Browser, Page } from "puppeteer-core";
import { mainPrompt } from "../lib/prompts/main";
import { getActivePage, getBrowser } from "../lib/browser/attachToBrowser";

class CommandProcessor {
  messages: ChatCompletionRequestMessage[];

  browser: Browser | null = null;

  page: Page | null = null;

  constructor(goal: string) {
    this.messages = mainPrompt(goal);
  }

  async connectToBrowser(): Promise<void> {
    this.browser = await getBrowser();
    const activePage = await getActivePage(this.browser);

    if (!activePage) this.page = await this.browser.newPage();
    else this.page = activePage;

    await this.page.bringToFront();
  }

  async getCurrentContext() {
    return "";
  }

  async getNextStep() {
    return "";
  }

  async run(): Promise<void> {
    if (!this.browser || !this.page) return;
    await this.getNextStep();
    await this.getCurrentContext();
  }
}

export const processCommand = async (command: string): Promise<void> => {
  const commandProcessor = new CommandProcessor(command);
  await commandProcessor.connectToBrowser();
  await commandProcessor.run();
};
