import { Page } from "puppeteer-core";
import clickJSON from "@luna/model/functions/click.json";
import { getAriaNode } from "../browser/getAriaNode";

export const click = clickJSON;

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
