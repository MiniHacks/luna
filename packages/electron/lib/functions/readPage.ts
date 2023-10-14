export const readPage = {
  name: "readPage",
  description: "Read the contents of a webpage",
  parameters: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The URL of the page to read",
      },
    },
    required: ["url"],
  },
};

export const readPageImplementation = (): void => {};
