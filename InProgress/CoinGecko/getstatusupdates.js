exports.id = 'getstatusupdates';
exports.title = 'CoinGecko Get Status Updates';
exports.group = 'CoinGecko';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'newspaper';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="category" data-jc-config="items:,General|general,Milestone|milestone,Partnership|partnership,Exchange Listing|exchange_listing,Software Release|software_release,Fund Movement|fund_movement,New Listings|new_listings,Event|event" class="m">@(Select a Category of Updates)</div><div class="help"></div>
        </div>
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="project_type" data-jc-config="items:Coin|coin,Market|market" class="m">@(Select a Project Type i.e. Coin or Market)</div><div class="help"></div>
        </div>
    </div>
</div>
`;

exports.readme = '60000477722';

exports.install = function(instance) {

    const CoinGecko = require('coingecko-api');
    const CoinGeckoClient = new CoinGecko();

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });
    
    async function runIt(flowdata) {
        let data = await CoinGeckoClient.statusUpdates.all({
            category: instance.options.category,
            project_type: instance.options.project_type
        });

        flowdata.data = data;

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata);
    };
};