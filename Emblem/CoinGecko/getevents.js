const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const TYPESTRIGGER = 'getCoinGeckoEventTypesList';
const COUNTRIESTRIGGER = 'getCoinGeckoCountries';

exports.id = 'getevents';
exports.title = 'Get Events';
exports.group = 'CoinGecko';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'calendar-day';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ 'coingecko-api' ];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="types" data-jc-config="datasource:typelist;empty:" class="m">@(Event Type)</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="countries" data-jc-config="datasource:countrylist;empty:" class="m">@(Country of Event)</div>
        </div>
    </div>
</div>
<script>
    ON('open.getevents', function(component, options) {
        TRIGGER('getCoinGeckoEventTypesList', 'typelist');
        TRIGGER('getCoinGeckoCountries', 'countrylist');
    });
</script>`;

exports.readme = '60000531495';

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    async function runIt(flowdata) {
        json = {};
        if(instance.options.types) json["type"] = instance.options.types;
        if(instance.options.countries) json["country_code"] = instance.options.countries;
        
        let data = await CoinGeckoClient.events.all(json);

        flowdata.data = data;

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata);
    };
};

FLOW.trigger(TYPESTRIGGER, function(next) {
    CoinGeckoClient.events.fetchTypes().then(types=> {
        next(types.data.data);
    });
});

FLOW.trigger(COUNTRIESTRIGGER, function(next) {
    CoinGeckoClient.events.fetchCountries().then(countries=> {
        var whatevs = countries.data.data.map(item=>{return {name: item.country, id: item.code}});
        next(whatevs);
    });
})
