const MARKETSTRIGGER = 'getBittrexMarkets';
const INTERVALSTRIGGER = 'getTimeIntervals';
const { BittrexClient } = require('bittrex-node')
let client = new BittrexClient({
    apiKey: '',
    apiSecret: ''
});
const Bittrex = require('bittrex-api-node');
const api = Bittrex({
    publicKey: '',
    secretKey: '',
    verbose: true,
});

exports.id = 'getchartdata';
exports.title = 'Get Chart Data for a Market';
exports.group = 'Bittrex';
exports.color = '#0084d4';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'shopping-bag';
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
            <div data-jc="dropdown" data-jc-path="interval" data-jc-config="datasource:intervallist;required:true;empty:" class="m">@(Select a time interval i.e. One Minute)></div>
        </div>
    </div>
</div>
<script>
    ON('open.getchartdata', function(component, options) {
        TRIGGER('getBittrexMarkets', 'marketlist');
        TRIGGER('getTimeIntervals', 'intervallist');
    });
</script>`;

exports.readme = '60000611315';

exports.install = function(instance) {
    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    function runIt(flowdata) {
        api.getTicks(instance.options.markets, instance.options.interval).then((response) => {
            flowdata.data = response;
            instance.send(flowdata);
        })
    };
};

FLOW.trigger(MARKETSTRIGGER, function(next) {
    client.markets().then(markets=> {
        var marketinfo = markets.map(item=>{return {name: item.MarketName, id: item.MarketName}});
        next(marketinfo);
    });
});
FLOW.trigger(INTERVALSTRIGGER, function(next) {
    intervals  = [
        {
            'name': 'One Minute',
            'id': 'oneMin'
        },
        {
            'name': 'Five Minutes',
            'id': 'fiveMin'
        },
        {
            'name': 'Thirty Minutes',
            'id': 'thirtyMin'
        },
        {
            'name': 'One Hour',
            'id': 'hour'
        },
        {
            'name': 'One Day',
            'id': 'day'
        }
    ] 
    var intervalinfo = intervals.map(item=>{return {name: item.name, id: item.id}});
        next(intervalinfo);
});
