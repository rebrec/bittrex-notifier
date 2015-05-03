var settings = {
    delay : 5, // minutes
    verbose: true,
    warning_threshold : 1.25, // 1.%%
    invested_markets : [
        {
            'market_name' : 'BTC-UTC',
            'my_bid' : 0.00001163
        },
        {
            'market_name' : 'BTC-EKN',
            'my_bid' : 0.00001600
        },
    ]
};

var request = require('request');

var host = 'http://bittrex.brainpad.org',
    markets_api_uri = '/api/get_markets',
    market_summary_api_uri = '/api/get_market_summary/';

// todo: every /delay/ minutes execute the loop

settings.invested_markets.forEach(function(market) {
    getCurrentMarketDetails(market.market_name, function(details) {
        v('Fetching ' + market.market_name + '...');
        // calculate change percentage
        var diff = details.Last / market.my_bid;
        v('Difference (' + details.Last.toFixed(8) + '/' + market.my_bid.toFixed(8) + ') = ' + diff + '%');
        // if percentage is higher than warning threshold, notify
        if (diff > settings.warning_threshold) {
            v('Diff (' + diff + ') is over threshold (' + settings.warning_threshold + ')!');
            console.log('[*] You should check out ' + market.market_name + '!');
        }
    });
});

function getCurrentMarketDetails(market_name, done) {
    request(host + market_summary_api_uri + market_name, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            if (data.success) {
                done(data.result[0]);
            } else {
                done(false);
            }
        }
    });
}

function v(msg) {
    if (settings.verbose) {
        console.log('[v] ' + msg);
    }
}