export const getCurrentWeather = {
  name: "get_current_weather",
  description: "Get the current weather in a given location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g. San Francisco, CA",
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
      },
    },
    required: ["location"],
  },
};

export const getCurrentWeatherImplementation = (
  location: string,
  unit = "fahrenheit"
) => {
  // Get the current weather in a given location
  const weatherInfo = {
    location,
    temperature: "72",
    unit,
    forecast: ["sunny", "windy"],
  };
  return JSON.stringify(weatherInfo);
};
