// #### https://github.com/shrimpy-dev/shrimpy-node
exports.id = 'getexchangeassets';
exports.title = 'Get Exchange Assets';
exports.group = 'Shrimpy';
exports.color = '#c13333';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'coins';
exports.version = '1.0.0';
exports.options = {  };
exports.npm = ["shrimpy-node"];
exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="exchange" data-jc-config="items:Binance|binance,Binance US|binanceus,Bittrex|bittrex,KuCoin|kucoin,CoinbasePro|coinbasepro,Poloniex|poloniex,Kraken|kraken,Bibox|bibox,Gemini|gemini,HuiboGlobal|huobiglobal,HitBTC|hitbtc,BitMart|bitmart,Bitstamp|bitstamp,OKEx|okex,Bitfinex|bitfinex;required:true" class="m">@(Select an Exchange)</div>
        </div>
    </div>
</div>`;

exports.readme = `# Shrimpy Get Exchange Assets

This endpoint retrieves exchange asset information for the selected exchange.

## Fields

*Select an Exchange* (required): This is the exchange you want to get asset popularity from.

[Shrimpy Documentation](https://developers.shrimpy.io/docs/#get-exchange-assets)
`;

exports.install = function(instance) {
    const Shrimpy = require('shrimpy-node');
    const publicClient = new Shrimpy.ShrimpyApiClient();
	instance.on('data', (response) => {
        publicClient.getExchangeAssets(instance.options.exchange).then(assets =>{
            response.data = JSON.parse(JSON.stringify(assets));
            instance.send(response);
        })   
    });
};
