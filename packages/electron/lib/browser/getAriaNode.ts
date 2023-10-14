import { ElementHandle, Page } from "puppeteer-core";

type AriaNode = {
  role: string;
  name: string;
};
export const getAriaNode = async (
  node: AriaNode,
  page: Page
): Promise<ElementHandle | null> => {
  const { role, name } = node;
  return page.$(`aria/${name}[role="${role}"]`);
};
