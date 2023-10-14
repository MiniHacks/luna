import { Page } from "puppeteer-core";
import { getAriaNode } from "../browser/getAriaNode";

export const click = {
  name: "click",
  description: "Click on a given element on the page",
  parameters: {
    type: "object",
    properties: {
      role: {
        type: "string",
        description: "The role of the element to click on",
      },
      name: {
        type: "string",
        description: "The name of the element to click on",
      },
    },
    required: ["role", "name"],
  },
};

type ClickArgs = {
  role: string;
  name: string;
};

export const clickImplementation = async (
  args: ClickArgs,
  page: Page
): Promise<boolean> => {
  const { role, name } = args;
  const node = await getAriaNode({ role, name }, page);
  if (node) {
    await node.click();
    return true;
  }
  return false;
};
