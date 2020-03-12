const MARKETSTRIGGER = 'getBittrexMarkets';
const { BittrexClient } = require('bittrex-node')
let client = new BittrexClient({
    apiKey: '',
    apiSecret: ''
});

exports.id = 'getorderbook';
exports.title = 'Get Order Book';
exports.group = 'Bittrex';
exports.color = '#0084d4';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'book';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="markets" data-jc-config="datasource:marketlist;required:true;empty:" class="m">@(Market Name)</div>
        </div>
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="ordertype" data-jc-config="items:Buy|buy,Sell|sell,Both|both;required:true;empty:" class="m">@(Select an Order Type i.e. Buy or Sell)</div><div class="help"></div>
        </div>
    </div>
</div>
<script>
    ON('open.getorderbook', function(component, options) {
        TRIGGER('getBittrexMarkets', 'marketlist');
    });
</script>`;

exports.readme = '60000611363';

exports.install = function(instance) {
    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    async function runIt(flowdata) {
        let data = await client.orderBook(instance.options.markets, { type: instance.options.ordertype });
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
