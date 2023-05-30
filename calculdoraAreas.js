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
      WELCOME_MESSAGE: 'Hi, Im an area calculator. Try saying something like, "What is the area of a triangle with a base of 5 centimeters and a height of 3 centimeters?"',
      HELLO_MESSAGE: 'Hello World!',
      HELP_MESSAGE: 'To use this program you have to tell me something like "What is the area of a triangle with a base of 5 centimeters and a height of 3 centimeters?"',
      GOODBYE_MESSAGE: 'See you later, come back soon!',
      REFLECTOR_MESSAGE: 'You just triggered %s',
      FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
      ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
      ANSWER: 'The area of ',
      METRIC_WITHOUT:'I still cant calculate the area of this figure, try again with another',
      ANSWER_ERROR:'Your values must be greater than 0',
      UNIT_ERROR:'An error has occurred with the unit of measure'
    }
  },
  es:{
    translation: {
      WELCOME_MESSAGE: 'Hola soy una calculadora de areas, trata diciendo algo como ¿Cual es el area de un triangulo de 5 centimetros de base y 3 centimetros de altura?"',
      HELLO_MESSAGE: 'Hola Mundo!',
      HELP_MESSAGE: 'Para usar este programa debes decirme algo parecido a ¿Cual es el area de un triangulo de 5 centimetros de base y 3 de altura?"',
      GOODBYE_MESSAGE: '¡Hasta luego, que vuelvas pronto!',
      REFLECTOR_MESSAGE: 'Acabas de activar %s',
      FALLBACK_MESSAGE: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
      ANSWER: 'El área del ',
      METRIC_WITHOUT:'Aun no puedo hacer el calculo del area de esta figuro intenta de nuevo con otro',
      ANSWER_ERROR:'Tus valores deben ser mayores a 0',
      UNIT_ERROR:'Ha ocurrido un error con la unidad de medida'
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


const calculadoraAreasintentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" 
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "calculadoraAreasintent"
        ;
    },
    handle(handlerInput) {
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        
        var figure = handlerInput.requestEnvelope.request.intent.slots.figure.value;
        var medidaUno = handlerInput.requestEnvelope.request.intent.slots.medidaUno.value;
        var unidad = handlerInput.requestEnvelope.request.intent.slots.unidad.value;
        var medidaDos = handlerInput.requestEnvelope.request.intent.slots.medidaDos.value;
        let resultado;
        let response;
        
        if(medidaUno > 0 && medidaDos > 0 || medidaUno > 0){
            
            if(figure == "triangulo" || figure == "triangle"){
                resultado = parseFloat((medidaUno*medidaDos)/2)
                
                if(unidad == "centimeters" || unidad == "meters" || unidad == "units")  {
                    response = requestAttributes.t('ANSWER') + figure + " "+ resultado + " " +"square" + " " + unidad;   
                }else if(unidad == "centimetros" || unidad == "metros" || unidad == "unidades"){
                    response = requestAttributes.t('ANSWER') + figure + " "+ resultado + " " + unidad + " "+ "cuadrados";   
                }else{
                    response = requestAttributes.t('UNIT_ERROR')
                }
                    
            }else if(figure == "rectangulo" || figure == "rectangle"){
                resultado = parseFloat((medidaUno*medidaDos))
                if(unidad == "centimeters" || unidad == "meters" || unidad == "units")  {
                    response = requestAttributes.t('ANSWER') + figure + " "+ resultado + " " +"square" + " " +unidad;   
                }else if(unidad == "centimetros" || unidad == "metros" || unidad == "unidades"){
                    response = requestAttributes.t('ANSWER') + figure + " "+ resultado +" " + unidad + " cuadrados";   
                }else{
                    response = requestAttributes.t('UNIT_ERROR')
                }
                
            }else if( figure == "circulo" ||figure == "circle"){
                resultado = parseFloat(medidaUno * medidaUno * (3.1416) )
                if(unidad == "centimeters" || unidad == "meters" || unidad == "units")  {
                    response = requestAttributes.t('ANSWER') + figure + " "+ resultado + " " +"square" + " " + unidad;   
                }else if(unidad == "centimetros" || unidad == "metros" || unidad == "unidades"){
                    response = requestAttributes.t('ANSWER') + figure + " "+ resultado + " " + unidad +" "+ "cuadrados";   
                }else{
                    response = requestAttributes.t('UNIT_ERROR');
                }
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
        calculadoraAreasintentHandler,
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
