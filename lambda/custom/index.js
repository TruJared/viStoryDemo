const Alexa = require('ask-sdk-core');
const Helpers = require('./helpers');

// TODO add in welcome back message //
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the story. Say yes to begin your cool adventure.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('V.I. Story Demo', speechText)
      .getResponse();
  },
};

const MakeChoiceHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (
      request.type === 'IntentRequest'
      && attributes.inGame
      && request.intent.name === 'MakeChoiceIntent'
    );
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    Helpers.getNextPassage(handlerInput);
    const speechText = attributes.text;
    console.log(JSON.stringify(attributes));

    // check if is end :(
    if (attributes.isEnd) {
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('V.I. Story Demo', 'the end')
        .getResponse();
    }

    // if not end :)
    // deconstruct objects
    const { choices } = attributes;
    let repromptText = 'Here are your choices: ';
    choices.forEach(value => (repromptText += `| ${value.name} | `));

    // console.dir(attributes, false, null, true);
    // console.dir(repromptText, false, null, true);

    return handlerInput.responseBuilder
      .speak(`${speechText} ${repromptText}`)
      .reprompt(repromptText)
      .withSimpleCard('V.I. Story Demo', repromptText)
      .getResponse();
  },
};

const YesRequestHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.YesIntent'
      && !attributes.inGame
    );
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    // get data for section and deconstruct objects
    Helpers.getNextPassage(handlerInput);
    const speechText = attributes.text;
    const { choices } = attributes;
    let repromptText = 'Here are your choices: ';
    choices.forEach(value => (repromptText += `| ${value.name} | `));

    // console.dir(attributes, false, null, true);
    // console.dir(repromptText, false, null, true);

    return handlerInput.responseBuilder
      .speak(`${speechText} ${repromptText}`)
      .reprompt(repromptText)
      .withSimpleCard('V.I. Story Demo', repromptText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speechText = 'Help is not currently set up';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const speechText = 'Thanks for playing';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('demo', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const FallbackHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const { choices } = attributes;
    let repromptText = 'Here are your choices: ';
    choices.forEach(value => (repromptText += `| ${value.name} | `));

    return handlerInput.responseBuilder
      .speak(repromptText)
      .reprompt(repromptText)
      .withSimpleCard('V.I. Story Demo', repromptText)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    YesRequestHandler,
    MakeChoiceHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    FallbackHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
