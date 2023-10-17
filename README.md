## Inspiration
One of our teammates sprained his arm and wasn't able to type properly on his computer without it hurting :( For example, when he asked Siri to play a youtube video, he still had to manually click the play button rather than it be touch free. 

We created Luna, a voice assistant that makes any prompt totally touch free.

## What it does
- voice assistant with full browser control access 
- speech to text recognition (almost real time, or so we like to think)
- fine tuning openAI models with accessibility trees of any webpage

## How we built it
**Frontend**: Built with Electron and Next.js to have Luna show up on the screen at all times -- she's always watching

**Finetuning**: JSON files are formatted in an interesting way to be able to feed into the model. There are three roles, such as system, assistant and user, which we used for different things compared to the regular chat based LLM. 
- system: used for the actual prompt that the user would speak to Luna to
- assistant: function calls such as click, gotoPage, askUser, etc
- user: passed in either an accessibility tree or an answer to a clarifying question that the assistant would ask
These were all made into one large training data file from a Python script and fed into the model until the finetuning made the losses near 0. 

**Speech-to-Text**: completely on device using a Whisper-based model. We trained our own model for the wake word "Hey Luna"

## Challenges we ran into
There was SO MUCH json writing... three of our members were drowning in creating test data to test the model so it would finetune properly. Voice to text was also another challenge because Whisper is slow AF and we wanted something that could dictate in real time.

Researching the model to use lead us to Microsoft Azure, it was pretty quick but authentication took super long.

## Accomplishments that we're proud of
- Luna, did we pop off? "yes :D"
- Everything mostly works (keyword: mostly)

## What we learned
How to train models, how to click buttons on a website (basically automation of the browser)

## What's next for Luna
- Finetuning for dayssss, creating JSONs till our hands hurt or preferably writing a script does it for us
- Luna takes over the world, more specifically does super complex tasks on the browser
