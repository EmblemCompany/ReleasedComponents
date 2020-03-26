
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const COINSTRIGGER = 'getCoinGeckoCoins';


exports.id = 'getstatusupdatesforcoin';
exports.title = 'Get Status Updates For Coin';
exports.group = 'CoinGecko';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'newspaper';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ 'coingecko-api' ];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="inputtags" data-jc-path="coins" data-jc-config="required:true;placeholder:Type a coin name;dirsource:coinlist" class="m">@(Select Coin(s))</div>
        </div>
    </div>
</div>
<script>
    ON('open.simpleprice', function(component, options) {
        TRIGGER('getCoinGeckoCoins', 'coinlist');
    });
</script>
`;

exports.readme = '60000544122';

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });
    
    async function runIt(flowdata) {
        json = {};
        if(instance.options.coins) json["ids"] = instance.options.coins;

        let data = await CoinGeckoClient.coins.fetchStatusUpdates('bitcoin');

        flowdata.data = data;

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata);
    };
};