// import { createChild } from "../../../main.js";
import { Page } from "puppeteer-core";
import askUserJSON from "@luna/model/functions/askUser.json";
import { type } from "os";

export const askUser = askUserJSON;

// export const askUser = {
//   name: "askUser",
//   description:
//     "Prompt the user for input. The user's response can be used to fill out a form, answer a question, or click the right button.",
//   parameters: {
//     type: "object",
//     properties: {
//       question: {
//         type: "string",
//         description:
//           "The question to display to the user. Questions should be phrased as if they were being asked by a human.",
//       },
//     },
//     required: ["message"],
//   },
// };

type AskUserArgs = {
  question: string;
};
export const askUserImplementation = (
  args: AskUserArgs,
  page: Page
): string => {
  throw new Error("Not implemented");
  // const { question } = args;

  // const childWindow = createChild();
  //
  // let response;
  // ipcMain.on("item-received", (event, data) => {
  //   repsonse = data;
  //   // process the user input here
  //   childWindow.close();
  // });
  // childWindow.webContents.send("sendData", question);
  // return response;
  return "";
};
