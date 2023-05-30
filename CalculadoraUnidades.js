/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');


const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME')
const languageStrings = {
  en: {
    translation: {
      WELCOME_MESSAGE: 'Hello, I am a measurement unit converter, to make a conversion just tell me "How much is 10 centimeters in inches"',
      HELLO_MESSAGE: 'Hello World!',
      HELP_MESSAGE: 'To use this program you have to tell me something like "How much is 10 centimeters in inches?"',
      GOODBYE_MESSAGE: 'See you later, come back soon!',
      REFLECTOR_MESSAGE: 'You just triggered %s',
      FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
      ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
      ANSWER: 'The answer is.',
      METRIC_ONE:'inches',
      METRIC_TWO:'miles',
      METRIC_THREE:'yards',
      METRIC_FOR:'feet',
      METRIC_WITHOUT:'I dont understand what you mean, try again',
      ANSWER_ERROR:'Your number to convert must be greater than 0'
    }
  },
  es:{
    translation: {
      WELCOME_MESSAGE: 'Hola soy un convertidor de unidades de medida, para hacer una conversion solo dime "Cuanto es 10 centimetros en pulgadas"',
      HELLO_MESSAGE: 'Hola Mundo!',
      HELP_MESSAGE: 'Para usar este programa debes decirme algo parecido a "¿Cuanto es 10 centimetros en pulgadas?"',
      GOODBYE_MESSAGE: '¡Hasta luego, que vuelvas pronto!',
      REFLECTOR_MESSAGE: 'Acabas de activar %s',
      FALLBACK_MESSAGE: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
      ANSWER: 'La respuesta es: ',
      METRIC_ONE:'pulgadas',
      METRIC_TWO:'millas',
      METRIC_THREE:'yardas',
      METRIC_FOR:'pies',
      METRIC_WITHOUT:'No entiendo que es lo que me queries decir, intentalo de nuevo',
      ANSWER_ERROR:'Tu numero a convetir debe ser mayor a 0'
    }
  }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const convertidorMetricointentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" 
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "convertidorMetricointent"
        ;
    },
    handle(handlerInput) {
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        
        var numberConvert = handlerInput.requestEnvelope.request.intent.slots.unidad.value;
        var medidaUno = handlerInput.requestEnvelope.request.intent.slots.metricaUno.value;
        var medidaDos = handlerInput.requestEnvelope.request.intent.slots.metricaDos.value;
        let resultado;
        let response;
        
        if(parseFloat(numberConvert) > 0){
            
            if (medidaUno == "centimetros"  && medidaDos == "pulgadas" ||  medidaUno == "centimeters"  && medidaDos == "inches"){
                resultado = parseFloat(numberConvert /2.54)
                response = requestAttributes.t('ANSWER') + resultado + requestAttributes.t('METRIC_ONE');
            }else if(medidaUno == "metros"  && medidaDos == "millas" ||  medidaUno == "meters"  && medidaDos == "miles"){
                resultado = parseFloat(numberConvert /1609)
                response = requestAttributes.t('ANSWER') + resultado + requestAttributes.t('METRIC_TWO');
            }else if(medidaUno == "kilometros"  && medidaDos == "yardas" || medidaUno == "kilometers"  && medidaDos == "yards"){
                resultado = parseFloat(numberConvert * 1094)
                response = requestAttributes.t('ANSWER') + resultado + requestAttributes.t('METRIC_THREE');
            }else if(medidaUno == "metros"  && medidaDos == "pies" || medidaUno == "meters"  && medidaDos == "feet"){
                resultado = parseFloat(numberConvert * 3.281)
                response = requestAttributes.t('ANSWER') + resultado + requestAttributes.t('METRIC_FOR');
            }else{
                response = requestAttributes.t('METRIC_WITHOUT')
            }
            
        }else{
            response = requestAttributes.t('ANSWER_ERROR')
        }
        
        
        return handlerInput.responseBuilder
            .speak(response)
            .reprompt(response)
            .getResponse();
   
  }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE', intentName);
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}




/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        convertidorMetricointentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
