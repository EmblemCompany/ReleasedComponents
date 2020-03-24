const MARKETSTRIGGER = 'getBittrexMarkets';
const { BittrexClient } = require('bittrex-node')
let client = new BittrexClient({
    apiKey: '',
    apiSecret: ''
});
exports.id = 'getmarket';
exports.title = 'Get Specific Martket 24Hr Summary';
exports.group = 'Bittrex';
exports.color = '#0084d4';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'chart-line';
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
    ON('open.getmarket', function(component, options) {
        TRIGGER('getBittrexMarkets', 'marketlist');
    });
</script>`;

exports.readme = '60000611323';

exports.install = function(instance) {
    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    async function runIt(flowdata) {
        let data = await client.marketSummary(instance.options.markets);

        flowdata.data = data;
		instance.send(flowdata);
    };
};

FLOW.trigger(MARKETSTRIGGER, function(next) {
    client.markets().then(markets=> {
        var marketinfo = markets.map(item=>{return {name: item.MarketName, id: item.MarketName}});
        next(marketinfo);
    });
});