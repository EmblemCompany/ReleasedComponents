// #### https://github.com/shrimpy-dev/shrimpy-node
exports.id = 'getorderbooks';
exports.title = 'Get Order Books';
exports.group = 'Shrimpy';
exports.color = '#c13333';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'chart-pie';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

exports.readme = '60000315408';

exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="exchange" data-jc-config="items:Binance|binance,Binance US|binanceus,Bittrex|bittrex,KuCoin|kucoin,CoinbasePro|coinbasepro,Poloniex|poloniex,Kraken|kraken,Bibox|bibox,Gemini|gemini,HuiboGlobal|huobiglobal,HitBTC|hitbtc,BitMart|bitmart,Bitstamp|bitstamp,OKEx|okex,Bitfinex|bitfinex;required:true" class="m">@(Select an Exchange)</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div data-jc="textbox" data-jc-path="baseSymbol" data-jc-config="placeholder:eth;required:false">@(Base Symbol) </div>
        </div>
        <div class="col-md-3">
            <div data-jc="textbox" data-jc-path="quoteSymbol" data-jc-config="placeholder:btc;required:false">@(Quote Symbol) </div>
        </div>
        <div class="col-md-3">
            <div data-jc="textbox" data-jc-path="limit" data-jc-config="type:number;increment:true;placeholder:10">@(Number of Order Books) </div>
        </div>
    </div>
</div>`;

exports.install = function(instance) {
    const Shrimpy = require('shrimpy-node');
    const publicClient = new Shrimpy.ShrimpyApiClient();
    // const privateClient = new Shrimpy.ShrimpyApiClient(publicKey, privateKey);
	instance.on('data', (response) => {
        publicClient.getOrderBooks(
            instance.options.exchange,  // exchange
            instance.options.baseSymbol || '',      // baseSymbol
            instance.options.quoteSymbol || '',      // quoteSymbol
            instance.options.limit || 10          // limit
        ).then(orderBooks =>{
            response.data = JSON.parse(JSON.stringify(orderBooks, null, 4));
            if (instance.options.downstream) {
                response.set(instance.name, response.data);
            }
            instance.send(response);
        });        
    });
};
