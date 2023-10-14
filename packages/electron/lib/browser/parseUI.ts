import { Page, SerializedAXNode } from "puppeteer-core";

function filterSnapshot(
  snapshot: SerializedAXNode | null
): SerializedAXNode[] | undefined {
  return snapshot?.children
    ?.filter(
      (child) =>
        // child.role !== "StaticText" &&
        // child.role !== "LineBreak" &&
        // child.role !== "generic" &&
        // child.role !== "Paragraph" &&
        // child.role !== "Text" &&
        child.name !== "grammarly-integration" &&
        !child.name?.toLowerCase().includes("skip to ") &&
        !child.disabled
    )
    .map((child): SerializedAXNode => {
      if (child.children) {
        return {
          ...child,
          children: filterSnapshot(child),
        };
      }
      return child;
    })
    .map((child) => {
      delete child.haspopup;
      return child;
    });
  // join adjacent text nodes
  // .reduce((acc: SerializedAXNode[], child) => {
  //   if (
  //     acc.length > 0 &&
  //     acc[acc.length - 1].role.includes("Text") &&
  //     child.role.includes("Text")
  //   ) {
  //     acc[acc.length - 1].name += child.name;
  //     return acc;
  //   }
  //   return [...acc, child];
  // }, [])
}

export const getParseableUI = async (
  page: Page
): Promise<SerializedAXNode[] | undefined> => {
  const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
  return filterSnapshot(snapshot);
};
