import { ElementHandle, Page, SerializedAXNode } from "puppeteer-core";

export const axNodeToSelector = (node: SerializedAXNode): string => {
  const { name, role } = node;
  return `aria/${name ?? ""}[role="${role}"]`;
};

export const getAriaNode = async (
  node: SerializedAXNode,
  page: Page
): Promise<ElementHandle | null> => {
  return page.$(axNodeToSelector(node));
};
