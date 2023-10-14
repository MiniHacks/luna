import { config } from "dotenv";
import {
  OpenAIApi,
  Configuration,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from "openai";
import { AxiosResponse } from "axios";
import { MODELS } from "../config";

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;

/**
 * Format a message from the user to send to OpenAI
 * @param msg
 * @returns {{role: string, content}}
 */
export const um = (msg: string | string[]): ChatCompletionRequestMessage => ({
  role: "user",
  content: typeof msg !== "string" ? msg[0] : msg,
});

export const getCompletion = async (
  params: Partial<CreateChatCompletionRequest>
): Promise<CreateChatCompletionResponse> => {
  const options: CreateChatCompletionRequest = {
    messages: [],
    model: MODELS.FINE_TUNED,
    temperature: 0.0, // make it deterministic
    top_p: 0.98,
    ...params,
  };

  try {
    const { data } = await openai.createChatCompletion(options);
    console.log("Completion:", data);
    return data;
  } catch (e) {
    console.log("Error in getBrowserCompletion");
    console.error(e);
    console.log("Params:", params);
    console.log("Options:", options);
    return e;
  }
};
