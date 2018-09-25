const Story = require('./story.json');

const { passages } = Story;

const sessionData = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { request } = handlerInput.requestEnvelope;

  // if new game
  if (!attributes.inGame) {
    attributes.inGame = true;
    const passage = passages[0];
    const { links } = passage;
    attributes.text = passage.text;

    // build options object
    attributes.options = {};
    Object.entries(links).forEach(
      ([key]) => (attributes.options[key] = {
        name: links[key].name,
        pid: links[key].pid,
        inventoryItem: links[key].inventoryItem || false,
      }),
    );
  } else {
    const triggerWord = request.intent.slots.triggerWord.value;
    attributes.triggerWord = triggerWord;
  }
};

module.exports = { sessionData };
