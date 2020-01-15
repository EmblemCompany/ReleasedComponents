exports.id ="assetsid";
exports.title ="Get Asset Details";
exports.group ="CoinCap API 2.0";
exports.color ="#61affe";
exports.input =true;
exports.output =1;
exports.version ="0.0.1";
exports.author ="Shannon Code";
exports.icon ="info-circle";

exports.readme ='60000301839';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textbox" data-jc-path="id" data-jc-config="placeholder:bitcoin">@(id) </div>
            <div class="help"></div>
        </div>
    </div>
</div>`;


var request = {
    "method": "GET",
    "header": [],
    "url": {
        "raw": "{{host}}/v2/assets/:id",
        "host": [
            "api.coincap.io"
        ],
        "path": [
            "v2",
            "assets",
            ":id"
        ],
        "variable": [
            {
                "key": "id",
                "value": "bitcoin"
            }
        ]
    },
    "description": "`### Request\n\n| Key       | Required | Value   | Description |\n|-----------|----------|---------|-------------|\n| id        | required | bitcoin |  asset id   |\n\n### Response\n\n| Key       \t\t| Description |\n|-------------------|-------------|\n| id\t\t\t\t| unique identifier for asset |\n| rank\t\t\t\t| rank is in ascending order - this number is directly associated with the marketcap whereas the highest marketcap receives rank 1 |\n| symbol\t\t\t| \tmost common symbol used to identify this asset on an exchange |\n| name\t\t\t\t| proper name for asset |\n| supply\t\t\t| available supply for trading |\n| maxSupply \t\t| total quantity of asset issued |\n| marketCapUsd\t\t| supply x price |\n| volumeUsd24Hr \t| \tquantity of trading volume represented in USD over the last 24 hours |\n| priceUsd\t\t\t| volume-weighted price based on real-time market data, translated to USD |\n| changePercent24Hr | the direction and value change in the last 24 hours |\n| vwap24Hr\t\t\t| \tVolume Weighted Average Price in the last 24 hours |"
};

exports.install =function(instance) {

	instance.on('data', function(response) {
        theRequest = request
        RESTBuilder.make(function(builder) {
            var url = generateUrl(theRequest, response)
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
                if (instance.options.downstream) {
					response.set(instance.name, response.data);
				}
                instance.send(response);
			});
		});
	});

	instance.custom.send = function(message) {
		
	};

	instance.reconfigure = function() {

	};

	instance.on('options', instance.reconfigure);
    instance.reconfigure();
    
    function generateUrl(request, response) {
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
