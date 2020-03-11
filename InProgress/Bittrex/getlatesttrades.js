exports.id = 'getlatesttrades';
exports.title = 'Get Latest Trades for a Market';
exports.group = 'Bittrex';
exports.color = '#8bc53f';
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
        </div>
    </div>
</div>`;

exports.readme = '60000611324';

exports.install = function(instance) {
    const Bittrex = require('bittrex-api-node');
    const api = Bittrex({
        publicKey: '',
        secretKey: '',
        verbose: true,
        //TODO add the ticker options
    });
    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    function runIt(flowdata) {
        json = {};
        api.getMarketHistory('BTC-ZEN').then((response) => { // TODO replace with options
            console.log('[getMarketHistory(BTC-ZEN)] response:', response);
            flowdata.data = response;
            instance.send(flowdata);
        }).catch((error) => {
            console.error('[getMarketHistory(BTC-ZEN)] error:', error);
        }).finally(() => {
            console.log('[getMarketHistory(BTC-ZEN)] done!');
        });
    };
};

