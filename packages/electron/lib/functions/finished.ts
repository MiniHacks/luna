export const finished = {
  name: "finished",
  description:
    "Indicate that the task has finished, and pass any relevant information to the next agent. This must be the last function in a task.",
  parameters: {
    type: "object",
    properties: {
      information: {
        type: "object",
        description:
          "Any information that the next agent will need to complete their objective.",
      },
    },
    required: ["information"],
  },
};

export const finishedImplementation = () => {};
