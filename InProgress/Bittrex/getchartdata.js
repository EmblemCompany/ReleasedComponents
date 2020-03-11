exports.id = 'getchartdata';
exports.title = 'Get Chart Data for a Market';
exports.group = 'Bittrex';
exports.color = '#8bc53f';
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
        </div>
    </div>
</div>`;

exports.readme = '60000611315';

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
        api.getTicks('BTC-ZEN', Bittrex.TICKINTERVAL_DAY).then((response) => { // TODO allow selection here
            console.log('[getTicks(BTC-ZEN, day)] response:', response);
            flowdata.data = response;
            instance.send(flowdata);
        }).catch((error) => {
            console.error('[getTicks(BTC-ZEN, day)] error:', error);
        }).finally(() => {
            console.log('[getTicks(BTC-ZEN, day)] done!');
        });
    };
};

