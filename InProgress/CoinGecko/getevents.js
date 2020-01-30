const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const TRIGGER = 'getCoinGeckoEventTypesList';

exports.id = 'getevents';
exports.title = 'CoinGecko Get Events';
exports.group = 'CoinGecko';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'calendar-day';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="types" data-jc-config="datasource:typelist;empty:" class="m">@(Select an Event Type)</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="input" data-jc-path="country" data-jc-config="placeholder:US" class="m">@(Country Code)</div>
            <div class="help">Enter a 2-digit country code here. See <a href="https://www.coingecko.com/en/api#/events/countries" target="_blank">this page</a> for more info.</div>
        </div>
    </div>
</div>
<script>
    ON('open.getevents', function(component, options) {
	    TRIGGER('{0}', 'typelist');
    });
</script>`.format(TRIGGER);

exports.readme = '60000477722';

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    async function runIt(flowdata) {
        let data = await CoinGeckoClient.events.all({
            type: instance.options.type
        });

        flowdata.data = data;

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata);
    };
};

FLOW.trigger(TRIGGER, function(next) {
    console.log("in it bitch");
    var typelist = getTypes();
    next(typelist);
});

async function getTypes() {
    let types = await CoinGeckoClient.events.fetchTypes();
    console.log("got something like this", types.data.data);
    return types.data.data;
}