exports.id ="getdynamiccoinbalance";
exports.title ="Get Coin Balance by Address";
exports.group ="Emblem Services";
exports.color ="#61affe";
exports.input =true;
exports.output =1;
exports.version ="0.0.4";
exports.author ="Shannon Code";
exports.icon ="coins";
exports.options ={
    service: "dexray3",
    host: "api.emblemvault.io"
};

exports.readme = '60000315158';

exports.html = `<div class="padding">
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="asset" data-jc-config="placeholder:btc">@(asset) </div>
                <div class="help">This is the symbol for the asset, such as coval.</div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="coin" data-jc-config="placeholder:btc">@(chain) </div>
                <div class="help">This is the blockchain the asset lives on, such as eth for Coval.</div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="address" data-jc-config="placeholder:19cCGRb5XLuuzoRvDLyRm888G8ank5WFyM">@(address) </div>
                <div class="help">Try this example for btc, btc: 19cCGRb5XLuuzoRvDLyRm888G8ank5WFyM, or this example for coval, eth: 0x5b3cfb86a9575a2c42fd88aa71f0957004fa9209</div>
            </div>
        </div>
</div>
`;

exports.install =function(instance) {

	instance.on('data', function(flowdata) {
        RESTBuilder.make(function(builder) {
            var url = 'https://api.emblemvault.io/'+replaceTokenizedString(flowdata, flowdata.data.coin || instance.options.coin)+'/'+replaceTokenizedString(flowdata, flowdata.data.address || instance.options.address)+'/balance?asset='+ replaceTokenizedString(flowdata, flowdata.data.assert || instance.options.asset)
            builder.url(url);
            builder.header('service', 'dexray3')
            builder.method('get')
            builder.exec(function(err, api_response) {
				flowdata.data = {response: api_response}
				if (instance.options.downstream) {
                    flowdata.set(instance.name, flowdata.data);
                }
				instance.send(flowdata)
			});
        });
	});

	instance.custom.send = function(message) {
		
	};

	instance.reconfigure = function() {
		
	};

	instance.on('options', instance.reconfigure);
    instance.reconfigure();
    
    function replaceTokenizedString(response, myString) {
        var tokenRegex = /[^{\}]+(?=})/g
        var replaceArray = myString.match(tokenRegex);
        if (replaceArray) {
            replaceArray.forEach(item=>{
                    objectPath = item.replace('msg.', 'response.data.');
                    myString = myString.replace('{' + item + '}', eval(objectPath));
            })
        }
        return myString;
    }    
};
