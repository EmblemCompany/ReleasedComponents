exports.id = 'getorderbook';
exports.title = 'Get Order Book';
exports.group = 'Bittrex';
exports.color = '#8bc53f';
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
        </div>
    </div>
</div>`;

exports.readme = '60000611363';

exports.install = function(instance) {
    const { BittrexClient } = require('bittrex-node')
    let client = new BittrexClient({
        apiKey: '',
        apiSecret: ''
    });
    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    async function runIt(flowdata) {
        let data = await client.orderBook('BTC-ETH', { type: 'both' }); //TODO - make selectable

        flowdata.data = data;
		instance.send(flowdata);
    };
};