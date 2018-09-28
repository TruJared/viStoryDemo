const Story = require('./story.json');

const { passages } = Story;

const specialEvent = (handlerInput, special) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const event = special[0];
  console.log(`in special event ${special}`);

  // event controller, will eventually guide to other function calls
  switch (event) {
    case 'end' || 'event':
      attributes.choices = [];
      attributes.text = passages[attributes.pid].text;
      attributes.isEnd = true;
      console.log(JSON.stringify(attributes));

      break;

    case 'dice':
      attributes.choices = [];
      attributes.isEnd = true;

      // TODO change computerRoll to d6 //
      const computerRoll = 1 + Math.floor(Math.random() * 1);
      const playerRoll = 1 + Math.floor(Math.random() * 6);
      let resultText = '';

      if (computerRoll > playerRoll) {
        resultText = 'You lose! <break time="500ms" /> So it turns out the price of losing was being eaten by the creature. <audio src="https://s3.amazonaws.com/mudcrablife/polly.0aa50b3f-64e6-4d71-b772-777cccced6d5.mp3" />';
      } else {
        // win game and progress to next part of story
        resultText = 'You win! <break time="500ms" /> Looks like gambling comes pretty naturally to a posh mudcrab such as yourself. The creature looks both surprised and amused that you won. She rewards you with a large golden coin as promised.<audio src="soundbank://soundlibrary/musical/amzn_sfx_bell_short_chime_01"/> Seeing as a mud crab has no pockets, you decide that you should get this money put safely away. Perhaps the castle has a place you can store your coin or maybe you can find a place to hide the coin in the ocean?';
        attributes.isEnd = false;
        attributes.choices = [
          {
            name: 'castle',
            link: 'castle',
            pid: '7',
          },
          {
            name: 'ocean',
            link: 'ocean',
            pid: '4',
          },
        ];
      }
      console.log(`NPC rolls ${computerRoll} :::: Player rolls ${playerRoll}`);

      attributes.text = `From your understanding you are about to play a dice game. You're pretty sure that an equal or higher roll means you win the coin. You, however, are a little unclear on what happens if you lose. <break time='500ms' />. The Khajitt rolls a ${computerRoll} and you roll a ${playerRoll}. ${resultText}`;
      break;

      case ''

    // ! should never get here
    default:
      console.log('something has gone terribly wrong');
  }
};

const passageBuilder = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { special } = passages[attributes.pid];

  if (special.length > 0) {
    specialEvent(handlerInput, special);
  } else {
    attributes.choices = passages[attributes.pid].links;
    attributes.text = passages[attributes.pid].text;
  }
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
