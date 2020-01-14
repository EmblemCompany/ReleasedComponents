// #### https://github.com/shrimpy-dev/shrimpy-node
exports.id = 'getorderbooks';
exports.title = 'Get Order Books';
exports.group = 'Shrimpy';
exports.color = '#c13333';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'chart-pie';
exports.version = '1.0.0';
exports.options = {  };
exports.npm = ["shrimpy-node"];
exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="exchange" data-jc-config="items:Binance|binance,Binance US|binanceus,Bittrex|bittrex,KuCoin|kucoin,CoinbasePro|coinbasepro,Poloniex|poloniex,Kraken|kraken,Bibox|bibox,Gemini|gemini,HuiboGlobal|huobiglobal,HitBTC|hitbtc,BitMart|bitmart,Bitstamp|bitstamp,OKEx|okex,Bitfinex|bitfinex;required:true" class="m">@(Select an Exchange)</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div data-jc="textbox" data-jc-path="baseSymbol" data-jc-config="placeholder:xlm;required:false">@(Base Symbol) </div>
        </div>
        <div class="col-md-3">
            <div data-jc="textbox" data-jc-path="quoteSymbol" data-jc-config="placeholder:btc;required:false">@(Quote Symbol) </div>
        </div>
        <div class="col-md-3">
            <div data-jc="textbox" data-jc-path="limit" data-jc-config="type:number;increment:true;placeholder:10">@(Number of Order Books) </div>
        </div>
    </div>
</div>`;

exports.readme = `# Shrimpy Get Order Books

This component retrieves live order book data for the exchange specified.

## Fields

*Select an Exchange* (required): This is the exchange you want to get asset popularity from.

*Base Symbol* (optional): The base symbol. (e.g. XLM for a XLM-BTC market) quantity is in these units.

*Quote Symbol* (optional): The quote symbol. (e.g. BTC for a XLM-BTC market).

*Limit* (optional): The maximum number of asks and bids to retrieve. Defaults to 10 if not supplied.


[Shrimpy Documentation](https://developers.shrimpy.io/docs/#get-order-books)
`;

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
