const Story = require('./story.json');

const { passages } = Story;

const passageBuilder = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { pid } = attributes.choices;

  const passage = passages[pid - 1] || passages[0];
  const { links } = passage;

  attributes.inventoryItem = passage.inventoryItem || false;
  attributes.speechText = passage.text;

  // build choices object
  Object.entries(links).forEach(
    ([key]) => (attributes.choices[key] = {
      name: links[key].name,
      pid: links[key].pid,
    }),
  );
};

const getNextPassage = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { request } = handlerInput.requestEnvelope;

  // if new game
  if (!attributes.inGame) {
    attributes.inGame = true;
    attributes.choices = {};
    passageBuilder(handlerInput);
  } else {
    const triggerWord = request.intent.slots.triggerWord.value;
    const { choices } = attributes;

    // TODO check to make sure trigger word is valid //
    // find the correct pid
    Object.entries(choices).forEach(([key]) => {
      if (choices[key].name === triggerWord) {
        choices.pid = choices[key].pid;
      }
      passageBuilder(handlerInput);
    });
  }
};

module.exports = { getNextPassage };
