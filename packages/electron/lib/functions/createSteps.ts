export const createSteps = {
  name: "create_steps",
  description:
    "Create a list of steps that other browser agents should do to complete a task",
  parameters: {
    type: "object",
    properties: {
      task: {
        type: "string",
        description: "The task to complete",
      },
      steps: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
};

type CreateStepsArgs = {
  task: string;
  steps: string[];
};
export const createStepsImplementation = (args: CreateStepsArgs) => {
  // Create a list of steps to complete a task
  const { task, steps } = args;
  const stepsInfo = {
    task,
    steps,
  };
  return JSON.stringify(stepsInfo);
};
