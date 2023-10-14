import os
import openai
openai.api_key = "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"

response = openai.File.create(
  file=open("../data/training_data.jsonl", "rb"),
  purpose='fine-tune'
)
openai.FineTuningJob.create(training_file="file-71CKi74S7Mx2LKSNs3GJ98c9", model="gpt-3.5-turbo")
