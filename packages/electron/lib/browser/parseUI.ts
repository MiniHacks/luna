/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Page, SerializedAXNode } from "puppeteer-core";
import { ChatCompletionRequestMessage } from "openai";
import { um } from "../vendor/openai";
import { axNodeToSelector } from "./getAriaNode";

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
    });
  // .map((child) => {
  //   delete child.haspopup;
  //   return child;
  // });
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

// const findNode = async (
//   page: Page,
//   node: SerializedAXNode,
//   parents: SerializedAXNode[]
// ) => {
//   const selector = axNodeToSelector(node);
//   const p = parents.map((parent) => axNodeToSelector(parent)).join(" ");
//
//   if (
//     !["StaticText", "LineBreak", "generic", "Paragraph", "Text"].includes(
//       node.role
//     )
//   ) {
//     // const lookup = p ? `${p} ${selector}` : selector;
//     const lookup = selector;
//     console.log(lookup);
//
//     const elementHandle = await page.$(lookup);
//     if (elementHandle) {
//       // see if element is visible:
//       const visible = await page.$eval(lookup, (el) => {
//         try {
//           const style = window.getComputedStyle(el);
//           return (
//             style &&
//             style.display !== "none" &&
//             style.visibility !== "hidden" &&
//             style.opacity !== "0"
//           );
//         } catch (e) {
//           return true;
//         }
//       });
//       if (visible) {
//         console.log("FV");
//       } else {
//         console.log("Found, not visible");
//       }
//     } else {
//       console.log("NF");
//     }
//   }
//   if (node.children) {
//     // eslint-disable-next-line no-restricted-syntax
//     for (const child of node.children) {
//       // eslint-disable-next-line no-await-in-loop
//       await findNode(page, child, [...parents, node]);
//     }
//   }
// };

const mergeAdjacentStaticTextHelper = (
  children: SerializedAXNode[]
): SerializedAXNode[] => {
  return children.reduce((acc: SerializedAXNode[], child) => {
    const prev = acc[acc.length - 1];
    if (
      acc.length > 0 &&
      prev.role === "StaticText" &&
      child.role === "StaticText"
    ) {
      acc[acc.length - 1].name = prev.name
        ? `${prev.name} ${child.name ?? ""}`
        : child.name ?? "";
      return acc;
    }
    return [...acc, child];
  }, []);
};

const isNodeVisible = async (page: Page, node: SerializedAXNode) => {
  const selector = axNodeToSelector(node);

  // console.log(`testing visibility of ${selector}`);
  const el = await page.$(selector);
  if (!el) {
    return false;
  }
  const box = await el.boundingBox();
  const windowBox = await page.evaluate(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  if (!box || !windowBox) return true;

  const visible = !(
    box.x + box.width < 0 ||
    box.y + box.height < 0 ||
    box.x > windowBox.width ||
    box.y > windowBox.height
  );
  // console.log(
  //   visible,
  //   selector,
  //   JSON.stringify(box),
  //   JSON.stringify(windowBox)
  // );
  return visible;
};

const mergeAllAdjacentStaticText = async (
  page: Page,
  root: SerializedAXNode
): Promise<SerializedAXNode> => {
  if (root.children) {
    // test visibility of each child first
    const mergedChildren = mergeAdjacentStaticTextHelper(root.children);

    const filteredChildren = [];

    for (const child of mergedChildren) {
      const visible = true;
      await isNodeVisible(page, child);
      if (visible) {
        filteredChildren.push(await mergeAllAdjacentStaticText(page, child));
      }
    }

    return {
      ...root,
      children: filteredChildren,
    };
  }
  return root;
};

export const getParseableUI = async (
  page: Page
): Promise<SerializedAXNode[] | undefined> => {
  const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
  if (!snapshot) return undefined;

  const merged = await mergeAllAdjacentStaticText(page, snapshot);

  // console.log(merged);
  // await findNode(page, snapshot, []);
  return filterSnapshot(merged);
};

export const createMessageFromPageContent = async (
  page: Page
): Promise<ChatCompletionRequestMessage> => {
  const url = page.url();
  const title = await page.title();
  const content = await getParseableUI(page);

  const message = JSON.stringify({
    url,
    title,
    content,
  }).substring(0, 8000);

  console.log(message);

  return um(message);
};
