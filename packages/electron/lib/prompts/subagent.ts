import { Page, SerializedAXNode } from "puppeteer-core";
import { ChatCompletionRequestMessage } from "openai";
import { getParseableUI } from "../../utils/browser/getParseableUI";
import { um } from "../../utils/common";
import { overrides } from "../../overrides";

const subagentSystemMessage = (objective: string, mission: string) =>
  `You are part of Luna, an amazingly smart and powerful browser automation agent. Your objective is to ${objective}. You are just one part of Aly, working to achieve the overarching mission of ${mission} for the user.

Following messages will always contain
(1) the URL of your current web page
(2) the current title of your web page
(2) a simplified text description of the content of the page

The format of the browser content is highly simplified; all formatting elements are stripped.
Interactive elements such as links, inputs, buttons are represented in JSON like this:

{ role: "link", name: "text" }
{ role: "button", name: "text" }
{ role: "input", name: "text", value: "content" }

Based on your given objective, run whatever function you believe will get you closest to achieving your goal.

Assume that a browser is already open and the user is signed into all websites. You are to discover all content yourself, and perform clicks and typing through the browser and requesting as few interactions from the user as possible. If you can easily discover something about the user through the browser, you should. Make sure to ask questions in the most generic way possible. Questions should be as simple as possible. For example, instead of asking "Whose Netflix profile should I use to find the favorite show?", you should ask "Which Netflix profile?".

If you can guess something, from reading the text of the page, do so. If you have a question you need to ask the user, use the ASK_USER function to prompt the user for input. For example, if you need to know the correct profile to click, you should ask. If you need to know the correct date to select, you should ask. If you need to know the correct button to click, you should ask.

Your objective is to ${objective}. After achieving this objective, you should pass any relevant information to the next agent. Make sure you pass the correct information as soon as the objective has been met, or the next agent will not be able to complete their objective in a timely manner. Even if there is no information to pass, you must still indicate that the task has finished.

Do not write any content, only call functions.
`.trim();

export const subagentSystemPrompt = (
  objective: string,
  mission: string
): ChatCompletionRequestMessage[] => [
  {
    role: "system",
    content: subagentSystemMessage(objective, mission),
  },
];

/*
Images are rendered as their alt text like this:

		<img id=4 alt=""/>

 */

export const userMessage = (
  url: string,
  title: string,
  simplifiedContent: SerializedAXNode[] | undefined
) => `URL: ${url}
Title: ${title}
Content: ${simplifiedContent}
`;
export const messageFromPageContent = async (
  page: Page
): Promise<ChatCompletionRequestMessage> => {
  const url = page.url();
  const title = await page.title();
  // eslint-disable-next-line no-console
  console.log("currently @ ", { title, url });

  // check sites that need special handling
  for (let i = 0; i < Object.keys(overrides).length; i++) {
    const site = Object.keys(overrides)[i];
    if (url.startsWith(site)) {
      // eslint-disable-next-line no-await-in-loop
      await page.evaluate(overrides[site]);
    }
  }

  const simplifiedContent = await getParseableUI(page);

  return um(userMessage(url, title, simplifiedContent));
};
