exports.id ="sendsms";
exports.title ="Send SMS";
exports.group ="ClickSend";
exports.color ="#49cc90";
exports.input =true;
exports.output =1;
exports.version ="1.0.0";
exports.author ="Shannon Code";
exports.icon ="commenting-o";
exports.options ={};
exports.npm =[];


exports.readme = `# Send SMS

This component sends an SMS message using ClickSend.

\`message\`: Enter the message that will go into the SMS here. The format looks like this:
\`[ { "source":"Circuit Builder", "body":"Hello from Emblem", "to":"+12345678901" } ]\`

\`username\`: Enter your ClickSend username here

\`password\`: Enter your ClickSend password here
`;

var request = {
    "auth": {
        "type": "basic",
        "basic": [
            {
                "key": "password",
                "value": "{{password}}",
                "type": "string"
            },
            {
                "key": "username",
                "value": "{{username}}",
                "type": "string"
            }
        ]
    },
    "method": "POST",
    "header": [
        {
            "key": "Content-Type",
            "value": "application/json"
        }
    ],
    "body": [
        {
            "key": "messages",
            "value": [
                {
                    "source": "php",
                    "body": "Jelly liquorice marshmallow candy carrot cake 4Eyffjs1vL.",
                    "to": "+17574691070"
                },
                {
                    "source": "php",
                    "body": "Chocolate bar icing icing oat cake carrot cake jelly cotton MWEvciEPIr.",
                    "list_id": 428
                }
            ]
        }
    ],
    "url": {
        "raw": "https://rest.clicksend.com/v3/sms/send",
        "protocol": "https",
        "host": [
            "rest",
            "clicksend",
            "com"
        ],
        "path": [
            "v3",
            "sms",
            "send"
        ]
    }
};
exports.install =function(instance) {

	instance.on('data', function(response) {
        theRequest = request
        RESTBuilder.make(function(builder) {
			// builder.url('https://{0}:{1}@api.twilio.com/2010-04-01/Accounts/{0}/Messages'.format(instance.options.key, instance.options.secret));
			// builder.urlencoded({ To: instance.options.target, From: instance.options.sender, Body: typeof(message) === 'object' ? JSON.stringify(message) : message.toString() });
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
                instance.send(response);
                // instance.send({response: response, url: url, parsedUrl: generateUrl(theRequest), builder: builder})
				LOGGER('Notifications', 'response:', JSON.stringify(response), 'error:', err);
			});
		});
	});

	instance.custom.send = function(message) {
		
	};

	instance.reconfigure = function() {
		//can = instance.options.key && instance.options.secret && instance.options.sender && instance.options.target ? true : false;
        //instance.status(can ? '' : 'Not configured', can ? undefined : 'red');
        
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
exports.html = `<div class="padding">
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="message" data-jc-config="placeholder:[ { "source":"Circuit Builder", "body":"Hello from Emblem", "to":"+12345678901" } ]">@(messages) </div>
                <div class="help"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="username" data-jc-config="placeholder:{{username}}">@(username) </div>
                <div class="help"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="password" data-jc-config="placeholder:{{password}};type:password">@(password) </div>
                <div class="help"></div>
            </div>
        </div>

</div>`