import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageFunctionCall,
} from "openai";
import { Browser, Page } from "puppeteer-core";
import { mainPrompt } from "../lib/prompts/main";
import { getActivePage, getBrowser } from "../lib/browser/attachToBrowser";
import { createMessageFromPageContent } from "../lib/browser/parseUI";
import { getCompletion } from "../lib/vendor/openai";
import { click, clickImplementation } from "../lib/functions/click";
import { askUser, askUserImplementation } from "../lib/functions/askUser";
import { finished } from "../lib/functions/finished";
import { gotoPage, gotoPageImplementation } from "../lib/functions/gotoPage";
import { type, typeImplementation } from "../lib/functions/type";
import { sleep } from "../lib/vendor/sleep";

class CommandProcessor {
  messages: ChatCompletionRequestMessage[];

  previousSteps: string[] = [];

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

    this.page.setDefaultNavigationTimeout(0);
  }

  async getNextStep(): Promise<ChatCompletionRequestMessageFunctionCall | null> {
    if (!this.browser || !this.page) return null;
    const message = await createMessageFromPageContent(
      this.page,
      this.previousSteps
    );

    const chatMessages = [...this.messages, message];
    console.log("chatMessages:", chatMessages);

    const completion = await getCompletion({
      messages: chatMessages,
      functions: [click, finished, gotoPage, type],
    });

    const nextStep = completion?.choices[0].message;
    if (!nextStep?.function_call) {
      console.log("No subagent message");
      return null;
    }

    return nextStep.function_call;
  }

  /**
   * Executes the command
   * @returns {boolean} Returns true if we're done running, false if we need to run again
   */
  async executeStep(
    function_call: ChatCompletionRequestMessageFunctionCall
  ): Promise<boolean> {
    if (!this.browser || !this.page || !function_call.arguments) return true;
    const args = JSON.parse(function_call.arguments);
    try {
      switch (function_call.name?.toLowerCase()) {
        case askUser.name.toLowerCase(): {
          const ans = askUserImplementation(args, this.page);
          if (ans) {
            this.previousSteps.push(`askUser:${args.question}`);
            return true;
          }
          break;
        }
        case finished.name.toLowerCase(): {
          return true;
        }
        case gotoPage.name.toLowerCase(): {
          await gotoPageImplementation(args, this.page);
          this.previousSteps.push(`gotoPage:${args.url}`);
          break;
        }
        // case readPage.name.toLowerCase(): {
        //   readPageImplementation();
        //
        //   break;
        // }
        case type.name.toLowerCase(): {
          await typeImplementation(args, this.page);
          this.previousSteps.push(
            `type:${args.role}:${args.name}:${args.value}`
          );
          break;
        }
        case click.name.toLowerCase(): {
          await clickImplementation(args, this.page);
          this.previousSteps.push(`click:${args.role}:${args.name}`);
          break;
        }
        default: {
          console.error("unknown function");
          // eslint-disable-next-line no-labels
          return true;
        }
      }
    } catch (e) {
      console.log(e);
      await sleep(1000);
    }

    return true;
  }

  /**
   * Runs the command
   * @returns {boolean} Returns true if we're done running, false if we need to run again
   */
  async runStep(): Promise<boolean> {
    if (!this.browser || !this.page) return true;
    const nextStep = await this.getNextStep();

    if (!nextStep) return true;
    return this.executeStep(nextStep);
  }
}

export const processCommand = async (command: string): Promise<void> => {
  console.log(`[pc] Processing command ${command}`);
  const commandProcessor = new CommandProcessor(command);
  await commandProcessor.connectToBrowser();
  console.log("[pc] Connected to browser");
  let done = false;
  let steps = 0;
  while (!done && steps < 20) {
    // eslint-disable-next-line no-await-in-loop
    done = await commandProcessor.runStep();
    steps += 1;
  }
};
