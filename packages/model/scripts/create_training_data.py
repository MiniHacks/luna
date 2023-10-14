import os
import copy
import json

# iterate over files in
# that directory
functions = []
for filename in os.listdir("../functions"):
    f = os.path.join("../functions", filename)
    # checking if it is a file
    if os.path.isfile(f):
        file = open(f, "r")
        functions.append(json.load(file))
        file.close()

func = {
    "functions" : functions
}

system = "Luna is a personal voice assistant that interacts with the user's browser. The goal is to "
with open("../data/finetuning_data.jsonl", mode='w', encoding='utf-8') as finetuningf:
    for filename in os.listdir("../data/trainingdata"):
        f = os.path.join("../data/trainingdata", filename)
        # checking if it is a file
        if os.path.isfile(f):
            file = open(f, "r")
            data = copy.deepcopy(json.loads(file.read()))
            goal = data["messages"][0]["content"]
            data["messages"][0]["content"] = system + " " + goal
            data["messages"].append(func)
            finetuningf.write(json.dumps(data) + "\n")
            file.close()
finetuningf.close()



