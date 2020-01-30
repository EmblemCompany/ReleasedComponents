const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const COINSTRIGGER = 'getCoinGeckoCoins';
const VSTRIGGER = 'getCoinGeckoVsCurrencies';

exports.id = 'simpleprice';
exports.title = 'CoinGecko Simple Price';
exports.group = 'CoinGecko';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'dollar-sign';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="listbox" data-jc-path="coins" data-jc-config="multiple:true;datasource:coinlist;search:Search;empty:" class="m">@(Select Coin(s))</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="listbox" data-jc-path="vs_currencies" data-jc-config="multiple:true;datasource:vscurrencies;search:Search;empty:" class="m">@(Vs Currencies)</div><div class="help">Which currency or currencies should the coin be compared against?</div>
        </div>
    </div>
</div>
<script>
    ON('open.simpleprice', function(component, options) {
        TRIGGER('getCoinGeckoCoins', 'coinlist');
        TRIGGER('getCoinGeckoVsCurrencies', 'vscurrencies');
    });
</script>`;

exports.readme = '60000477722';

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    async function runIt(flowdata) {
        let data = await CoinGeckoClient.simple.price({
            ids: instance.options.coins,
            vs_currencies: instance.options.vs_currencies
        });

        flowdata.data = data;

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata);
    };
};

FLOW.trigger(COINSTRIGGER, function(next) {
    CoinGeckoClient.coins.list().then(coins=> {
        var whatevs = coins.data.map(item=>{return {name: item.name, id: item.id}});
        next(whatevs);
    });
});

FLOW.trigger(VSTRIGGER, function(next) {
    CoinGeckoClient.simple.supportedVsCurrencies().then(currencies=> {
        next(currencies.data);
    });
})
