exports.id ="sms_getcoinbalancebyaddress";
exports.title ="SMS Template Get Coin Balance by Address";
exports.group ="Templates Only";
exports.color ="#61affe";
exports.input =true;
exports.output =1;
exports.version ="0.0.1";
exports.author ="Shannon Code";
exports.icon ="coins";
exports.options ={
    service: "dexray2",
    host: "api.emblemvault.io"
};

exports.readme = `# Emblem:Get Dynamic Coin Balance

This component will retrieve the balance from any cryptocurrency coin on any blockchain, given the address.

## Fields

\`asset\`: This is the name of the asset on the blockchain you are requesting a balance from.

\`coin\`: This is the name of the blockchain your asset lives on.

\`address\`: This is the address that contains the asset you would like the balance for.

## What is the difference between asset and coin?

In the most popular example, BTC, these are the same. The blockchain is the Bitcoin chain and the asset is Bitcoin.

In other examples, however, like ETH, there are many assets that use the same blockchain. Every ERC-20 asset uses an ETH address. Entering asset ensures that you get only the balance for that asset.

`;

exports.html = `<div class="padding">
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="asset" data-jc-config="placeholder:">@(asset) </div>
                <div class="help">This is the symbol for the asset, such as coval.</div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="coin" data-jc-config="placeholder:btc">@(coin) </div>
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

var request = {
    "method": "GET",
    "header": [],
    "url": {
        "raw": "{{host}}:{{port}}/:coin/:address/balance?asset=xcp",
        "host": [
            "{{host}}"
        ],
        "port": "{{port}}",
        "path": [
            ":coin",
            ":address",
            "balance"
        ],
        "query": [
            {
                "key": "asset",
                "value": "xcp"
            }
        ],
        "variable": [
            {
                "key": "coin",
                "value": "xcp"
            },
            {
                "key": "address",
                "value": "19cCGRb5XLuuzoRvDLyRm888G8ank5WFyM"
            }
        ]
    }
};
exports.install =function(instance) {

	instance.on('data', function(response) {
        theRequest = request
        RESTBuilder.make(function(builder) {
			var url = generateUrl(theRequest)
            builder.url(url);
            if (instance.options.service || response.data.service || FLOW.variables.service ) {
                builder.header('service', instance.options.service || response.data.service || FLOW.variables.service)
            }
            if (theRequest.header) {
                theRequest.header.forEach(header=>{
                    builder.header(header.key, header.value)
                })                
            }
            if (theRequest.auth) {
                if (instance.options['username']) {
                    if (instance.options['username'].includes('msg.')) {
                        instance.options['username'] = response.data[instance.options["username"].replace('msg.', '')]
                    }
                } 
                if (instance.options['password']) {
                    if (instance.options['password'].includes('msg.')) {
                        instance.options['password'] = response.data[instance.options["password"].replace('msg.', '')]
                    }
                }
                builder.auth(instance.options['username'] || response.data.username || FLOW.variables.username, instance.options['password'] || response.data.password || FLOW.variables.password)
            }
            var body = {}
            if (theRequest.body) {
                var body = {}
                if (theRequest.body.mode) {
                    theRequest.body = theRequest.body[theRequest.body.mode]
                }
                theRequest.body.forEach(item=>{
                    if (instance.options[item.key] || response.data[item.key] || FLOW.variables[item.key]) {
                        if (instance.options[item.key].includes('${')) {
                            var pieces = instance.options[item.key].split('$')
                            var replacedPieces = []
                            pieces.forEach((piece, index)=>{
                                if (piece.includes('{') && piece.includes('}')) {
                                    var editedPiece = piece.replace('{', 'response.data.')
                                    editedPiece = editedPiece.replace('}', '')
                                    var replacement = eval(editedPiece.trim())				                    
                                    replacedPieces.push(replacement)
                                } else {
                                    replacedPieces.push(piece)
                                }
                                if (pieces.length === index) {
                                    instance.options[item.key] = replacedPieces.join('')
                                }
                            })
                            instance.options[item.key] = replacedPieces.join('')
                        }
                        if (instance.options[item.key].includes('msg.')) {
                            instance.options[item.key] = response.data[instance.options[item.key].replace('msg.', '')]
                        }                        
                        try {
                            body[item.key] = JSON.parse(instance.options[item.key] || response.data[item.key] || FLOW.variables[item.key])
                        } catch(err){
                            body[item.key] = instance.options[item.key] || response.data[item.key] || FLOW.variables[item.key]
                        }                        
                    } else {
                        body[item.key] = item.value
                    }
                    
                })
                builder.json(body);      
            }
            builder.method(theRequest.method.toLowerCase() || 'get')
            builder.exec(function(err, response) {
                instance.send({response: response});
			});
		});
	});

	instance.custom.send = function(message) {
		
	};

	instance.reconfigure = function() {
		
	};

	instance.on('options', instance.reconfigure);
    instance.reconfigure();
    
    function generateUrl(request) {
        var url;
        if (request.url.protocol) {
            url = request.url.protocol + '://'
        } else {
            url = 'http://'
        }
        if (request.url.host) {
            var host = request.url.host.join('.')
            if (host.includes('{{host}}')) {
                host = host.replace('{{host}}', instance.options.host || response.data.host || FLOW.variables.host)
            }
            url = url + host
        }        
        if (request.url.path) {
            url = url +  '/' + request.url.path.join('/')
        }
        if (request.url.query) {
            url = url + '?'
            request.url.query.forEach(kvp => {
                if (instance.options[kvp.key] || response.data[kvp.key]) {
                    if (instance.options[kvp.key].includes('msg.')) {
                        instance.options[kvp.key] = response.data[instance.options[kvp.key].replace('msg.', '')]
                    }
                    url = url + kvp.key + '=' + instance.options[kvp.key] || response.data[kvp.key] || FLOW.variables[kvp.key] + '&'
                }
            })
        }
        if (request.url.variable) {
            request.url.variable.forEach(kvp => {
                if (instance.options[kvp.key] || response.data[kvp.key] || FLOW.variables[kvp.key]) {
                    if (instance.options[kvp.key].includes('msg.')) {
                        instance.options[kvp.key] = response.data[instance.options[kvp.key].replace('msg.', '')]
                    }
                    url = url.replace(':'+kvp.key, instance.options[kvp.key] || response.data[kvp.key] || FLOW.variables[kvp.key])
                }
            })
        }
        return url
    }
};
