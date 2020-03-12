const MARKETSTRIGGER = 'getBittrexMarkets';
const { BittrexClient } = require('bittrex-node')
let client = new BittrexClient({
    apiKey: '',
    apiSecret: ''
});
exports.id = 'getlatesttrades';
exports.title = 'Get Latest Trades for a Market';
exports.group = 'Bittrex';
exports.color = '#0084d4';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'exchange';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="markets" data-jc-config="datasource:marketlist;required:true;empty:" class="m">@(Market Name)</div>
        </div>
    </div>
</div>
<script>
    ON('open.getlatesttrades', function(component, options) {
        TRIGGER('getBittrexMarkets', 'marketlist');
    });
</script>`;

exports.readme = '60000611324';

exports.install = function(instance) {
    const Bittrex = require('bittrex-api-node');
    const api = Bittrex({
        publicKey: '',
        secretKey: '',
        verbose: true,
    });
    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    function runIt(flowdata) {
        api.getMarketHistory(instance.options.markets).then((response) => {
            flowdata.data = response;
            instance.send(flowdata);
        }).catch((error) => {
            console.error('[getMarketHistory('+instance.options.markets+')] error:', error);
        }).finally(() => {
            console.log('[getMarketHistory('+instance.options.markets+')] done!');
        });
    };
};

FLOW.trigger(MARKETSTRIGGER, function(next) {
    client.markets().then(markets=> {
        var marketinfo = markets.map(item=>{return {name: item.MarketName, id: item.MarketName}});
        next(marketinfo);
    });
});

