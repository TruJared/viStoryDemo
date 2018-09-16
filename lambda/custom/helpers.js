const Story = require('./story.json');

const { passages } = Story;

const sessionData = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const passage = passages[0];
  // TODO get options based on length of array length  //
  // TODO get options based on PID of utterance  //

  attributes.text = passage.text;
  attributes.options = {
    one: passage.links[0],
    two: passage.links[1],
    three: passage.links[2],
  };
};

module.exports = { sessionData };
