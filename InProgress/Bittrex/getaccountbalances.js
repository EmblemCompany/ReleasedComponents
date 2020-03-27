exports.id = 'getaccountbalances';
exports.title = 'Get Account Balances';
exports.group = 'Bittrex';
exports.color = '#0084d4';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'dollar';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
        </div>
    </div>
</div>
<div class="padding bg-smoke">
	<section>
		<label><i class="fa fa-lock"></i>@(HTTP basic access authentication)</label>
		<div class="padding npb">
			<div class="row">
				<div class="col-md-6 m">
					<div data-jc="textbox" data-jc-path="apiKey">@(API Key)</div>
                </div>
                <div class="col-md-6 m">
					<div data-jc="textbox" data-jc-path="apiSecret">@(API Secret)</div>
				</div>
			</div>
		</div>
	</section>
</div>`;

exports.readme = '60000614177';

exports.install = function(instance) {
    const { BittrexClient } = require('bittrex-node')
    instance.on('data', function(flowdata) {
        var apiKey;
        var apiSecret;
        if (instance.options.apiKey) { apiKey = instance.options.apiKey }
        if (instance.options.apiSecret) { apiSecret = instance.options.apiSecret }
        let client = new BittrexClient({
            apiKey: apiKey,
            apiSecret: apiSecret
        });
        runIt(flowdata, client);
    });

    async function runIt(flowdata, client) {
        let data = await client.balances();
        flowdata.data = data;
		instance.send(flowdata);
    };
};

