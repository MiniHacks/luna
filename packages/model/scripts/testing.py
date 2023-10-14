completion = openai.ChatCompletion.create(
  model="ft:gpt-3.5-turbo-0613:samyok::89PIhOnI",
  messages= [
      {"role": "user", "content": "What is 1+1"},
      {"role": "user", "content": "When is Halloween"},
      {"role": "user", "content": "What should I be for halloween"},
      {"role": "user", "content": "What does the fox say"},
      {"role": "user", "content": "How many marbles are in the jar"},
      {"role": "user", "content": "Play a trending YouTube video"},
      {"role": "user", "content": "Sell my couch on EBay"},
      {"role": "user", "content": "Tie my shoe"},
      {"role": "user", "content": "Good morning Luna"},
      {"role": "user", "content": "Order a burrito bowl from Chipotle"},
      {"role": "user", "content": "I lost my keys"},
      {"role": "user", "content": "FaceTime my brother"}
  ]
)