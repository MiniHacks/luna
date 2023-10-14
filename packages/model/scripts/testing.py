import openai
openai.api_key = "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"
completion = openai.ChatCompletion.create(
  model="ft:gpt-3.5-turbo-0613:samyok::89TSdNEg",
  messages= [
      {"role": "system", "content": "Open Netflix"},
  ]
)
print(completion)