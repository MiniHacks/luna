import os
import copy
import json
import re

# iterate over files in
# that directory
functions = []
for filename in os.listdir("../functions"):
    f = os.path.join("../functions", filename)
    # checking if it is a file
    if os.path.isfile(f):
        file = open(f, "r", encoding="utf-8")
        functions.append(json.load(file))
        file.close()

system = "Luna is a personal voice assistant that interacts with the user's browser. The goal is to "
with open("../data/finetuning_data.jsonl", mode='w', encoding='utf-8') as finetuningf:
    for filename in os.listdir("../data/trainingdata"):
        f = os.path.join("../data/trainingdata", filename)
        # checking if it is a file
        if os.path.isfile(f):
            print(filename)
            file = open(f, "r", encoding="utf-8")
            data = copy.deepcopy(json.loads(file.read()))
            print("original: ", data["messages"][0]["content"])
            goal = re.sub("(.*(L|l)una[^A-z0-9\s]*)*(.*please[^A-z0-9\s]*)*(.*you)*(.*please[^A-z0-9\s]*)*", "", data["messages"][0]["content"])
            print("goal: ", goal)
            print("________________________________\n\n")
            data["messages"][0]["content"] = system + " " + goal
            data["functions"] = functions
            finetuningf.write(json.dumps(data) + "\n")
            file.close()
        else:
            for filename_2 in os.listdir(f):
                f_2 = os.path.join(f, filename_2)
                if os.path.isfile(f_2):
                    print(filename_2)
                    file_2 = open(f_2, "r", encoding="utf-8")
                    data_2 = copy.deepcopy(json.loads(file_2.read()))
                    print(data_2["messages"][0]["content"])
                    goal_2 = re.sub("(.*(L|l)una[^A-z0-9\s]*)*(.*please[^A-z0-9\s]*)*(.*you)*(.*please[^A-z0-9\s]*)*", "", data_2["messages"][0]["content"])
                    print(goal_2)
                    print("________________________________\n\n")
                    data_2["messages"][0]["content"] = system + " " + goal_2
                    data_2["functions"] = functions
                    finetuningf.write(json.dumps(data_2) + "\n")
                    file_2.close()
finetuningf.close()



