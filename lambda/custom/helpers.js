const Story = require('./story.json');

const { passages } = Story;

const sessionData = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { request } = handlerInput.requestEnvelope;

  // if new game
  if (!attributes.inGame) {
    attributes.inGame = true;
    const passage = passages[0];

    attributes.text = passage.text;
    attributes.options = {
      one: passage.links[0],
      two: passage.links[1],
      three: passage.links[2],
    };
  } else {
    const triggerWord = request.intent.slots.triggerWord.value;
    attributes.triggerWord = triggerWord;
  }
};

module.exports = { sessionData };
