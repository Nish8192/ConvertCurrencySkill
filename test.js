var https = require('https')

var myData = {
    oCurr: "USD",
    dCurr: "GBP"
}

httpsGet(myData);

function httpsGet(myData){

    var options = {
        host: 'api.fixer.io',
        port: 443,
        path: '/latest?symbols='+myData.oCurr+','+myData.dCurr,
        method: 'GET',
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
            var oRate = pop.rates['USD']
            var dRate = pop.rates['GBP']
            var result = 50/oRate
            result *= dRate

            exRate = (1 / oRate) * dRate;
            console.log(exRate);
            console.log(50*exRate);
            console.log(result);
        });
    });
    req.end();
}

console.log("50"/.5);
