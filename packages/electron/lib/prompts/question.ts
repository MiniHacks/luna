import { ChatCompletionRequestMessage } from "openai";

const systemMessage = `
You are answering questions to test your knowledge. You should always respond with the correct response. Make sure to think through the problem really well. 

Answer the given activity. 

If the question asks you to create or solve part of a program, then you should output the entire program, but only the program.

If it's a coding question, only output code. Do not include text or comments.
`.trim();

export const questionPrompt: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: systemMessage,
  },
];
