import { Page } from "puppeteer-core";
import { getAriaNode } from "../../utils/browser/getAriaNode";
import { sleep } from "../../utils/common";

export const type = {
  name: "type",
  description: "Type a given value into a given element on the page",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the element to type into",
      },
      role: {
        type: "string",
        description: "The role of the element to type into",
      },
      value: {
        type: "string",
        description: "The value to type into the element",
      },
      pressEnter: {
        type: "boolean",
        description: "Whether or not to press enter after typing the value",
      },
    },
    required: ["name", "role", "value"],
  },
};

type TypeArgs = {
  name: string;
  role: string;
  value: string;
  pressEnter: boolean;
};
export const typeImplementation = async (
  args: TypeArgs,
  page: Page
): Promise<boolean> => {
  const { name, value, pressEnter, role } = args;
  const node = await getAriaNode({ name, role }, page);
  if (node) {
    // await node.click({ clickCount: 4 });
    await sleep(150);
    await node.type(value, { delay: 100 });
    if (pressEnter) {
      await node.press("Enter");
    }
    return true;
  }
  return false;
};
