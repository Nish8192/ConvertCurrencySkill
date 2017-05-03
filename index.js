'use strict';
var Alexa = require('alexa-sdk');
var https = require('https');




var APP_ID = "amzn1.ask.skill.4682794a-dbe5-4347-b08f-225dcd59873f"; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Currency Convert';

/**
 * Array containing space facts.
 */
var currency_TYPES = {
    "Australian dollars": "AUD",
    "Bulgarian lev": "BGN",
    "Brazil real": "BRL",
    "Canadian dollars": "CAD",
    "Swiss francs": "CHF",
    "Chinese yuan": "CNY",
    "Czech koruna": "CZK",
    "Danish krone": "DKK",
    "British pounds": "GBP",
    "Hong Kong dollars": "HKD",
    "Croatian kuna": "HRK",
    "Hungarian forints": "HUF",
    "Indonesia rupiah": "IDR",
    "Israeli shekels": "ILS",
    "Indian rupees": "INR",
    "Japanese yen": "JPY",
    "Korean won": "KRW",
    "Mexican pesos": "MXN",
    "Malaysian ringgit": "MYR",
    "Norway krone": "NOK",
    "New Zealand dollars": "NZD",
    "Phillippines pesos": "PHP",
    "Polish zloty": "PLN",
    "Romanian new leu": "RON",
    "Russian rubles": "RUB",
    "Swedish krona": "SEK",
    "Singapore dollars": "SGD",
    "Thailand baht": "THB",
    "Turkish lira": "TRY",
    "United States dollars": "USD",
    "South African rand": "ZAR"
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Introduce');
    },
    'ConvertCurrencyIntent': function () {
        this.emit('ConvertCurrency');
    },
    'Introduce': function(){
        this.emit(':tell', "Welcome to currency convertor, please tell me what currencies you want to convert.");
    },
    'ConvertCurrency': function () {

        var origCurr = this.event.request.intent.slots.OriginalCurr.value;
        var destCurr = this.event.request.intent.slots.DestCurr.value;
        var slotOrig = currency_TYPES[origCurr];
        var slotDest = currency_TYPES[destCurr];
        if(this.event.request.intent.slots.Amount){
            var amount = this.event.request.intent.slots.Amount.value;
        }
        else{
            var amount = null;
        }
        var myData = {
            oCurr: slotOrig,
            dCurr: slotDest,
            a: amount
        };
        console.log(myData);
        httpsGet(myData, (myResult) => {
            var origRate = myResult.rates[slotOrig];
            var destRate = myResult.rates[slotDest];
            if(amount){
                // amount = parseInt(amount);
                // destRate = parseInt(destRate);
                var result = amount * destRate;
                result = result.toFixed(2);
                var speechOutput = amount + " " + origCurr + " is " + result + " "+ destCurr;
            }
            else{
                var speechOutput = origCurr + " is exchanging at " + destRate + " "+ destCurr;
            }
            this.emit(':tell', speechOutput);
        })

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can give me a starting currency with or without an amount and an ending currency or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};


function httpsGet(myData, callback){

    var options = {
        host: 'api.fixer.io',
        port: 443,
        path: '/latest?symbols='+myData.oCurr+','+myData.dCurr,
        method: 'GET'
    };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            var pop = JSON.parse(returnData);
            console.log(pop);
            callback(pop);
        });
    });
    req.end();
}
