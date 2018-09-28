const Story = require('./story.json');

const { passages } = Story;

const passageBuilder = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  console.log(JSON.stringify(attributes));
  attributes.choices = passages[attributes.pid].links;
  attributes.text = passages[attributes.pid].text;
};

const getNextPassage = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();

  // if new game
  if (!attributes.inGame) {
    attributes.inGame = true;
    attributes.pid = 0;
    // start the choice loops
  } else {
    const { request } = handlerInput.requestEnvelope;
    const triggerWord = request.intent.slots.triggerWord.value;
    const { choices } = attributes;

    // TODO check to make sure trigger word is valid //
    // find the correct pid
    choices.forEach((choice) => {
      if (choice.name === triggerWord) {
        // * need -1 to offset at PID starts at 1
        attributes.pid = choice.pid - 1;
      }
    });
  }
  passageBuilder(handlerInput);
};

module.exports = { getNextPassage };
