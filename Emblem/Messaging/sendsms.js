exports.id ="sendsms";
exports.title ="Send SMS";
exports.group ="Messaging";
exports.color ="#b8375d";
exports.input =true;
exports.output =1;
exports.version ="0.0.5";
exports.author ="Shannon Code";
exports.icon ="sms";

exports.readme = '60000315237';

exports.html = `
    <div class="padding">
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="to" data-jc-config="placeholder:Recipient phone number">@(to) </div>
                <div class="help">This 
                needs to be in the E.164 standard format, which looks like the following:
                +[country code][subscriber number]. An example US phone number would be
                +18888511920.</div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="msg" data-jc-config="placeholder:Enter the text of your message here">@(msg) </div>
                <div class="help">To inject data into this message, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data">More info here</a></div>
            </div>
        </div>
    </div>
    <div class="padding bg-smoke">
        <section>
            <label><i class="fa fa-lock"></i>@(ClickSend authentication)</label>
            <div class="padding npb">
                <div class="row">
                    <div class="col-md-6 m">
                        <div data-jc="textbox" data-jc-path="username">@(Username)</div>
                    </div>
                    <div class="col-md-6 m">
                        <div data-jc="textbox" data-jc-path="password">@(Password)</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
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
                body.messages = []
                var smsBody = instance.options.msg || response.data.msg || FLOW.variables.msg
                if (smsBody.includes('{msg.')) {
                    smsBody = replaceTokenizedString(response, smsBody)
                }
                body.messages.push(
                    {
                        to: instance.options.to || response.data.to || FLOW.variables.to,
                        body: smsBody
                    }
                )
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

    function replaceTokenizedString(response, myString) {
        var tokenRegex = /[^{\}]+(?=})/g
        var replaceArray = myString.match(tokenRegex);

        replaceArray.forEach(item=>{
                objectPath = item.replace('msg.', 'response.data.')
        		myString = myString.replace('{' + item + '}', eval(objectPath))
        })
        return myString
    }
    
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
