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
        });
    });
    req.end();
}
