exports.id = 'getcurrencies';
exports.title = 'Get Currencies';
exports.group = 'Bittrex';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'coins';
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

exports.readme = '60000611321';

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
        let data = await client.currencies();

        flowdata.data = data;
		instance.send(flowdata);
    };
};

