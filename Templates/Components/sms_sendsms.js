exports.id ="sms_sendsms";
exports.title ="SMS Template Send SMS";
exports.group ="Template Components";
exports.color ="#49cc90";
exports.input =true;
exports.output =1;
exports.version ="0.0.2";
exports.author ="Shannon Code";
exports.icon ="sms";

exports.readme = '60000318108';

exports.html = `<div class="padding">
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
`;

exports.install =function(instance) {

	instance.on('data', function(flowdata) {
        
        RESTBuilder.make(function(builder) {
            var url = 'https://api.emblemvault.io/clicksend'
            builder.url(url);
            builder.header('service', 'cbproxy')
            builder.method('post')
            builder.json({
                "messages":[ 
                    { 
                        "source":"Circuit Builder", 
                        "body":replaceTokenizedString(flowdata, instance.options.msg || flowdata.data.msg), 
                        "to":replaceTokenizedString(flowdata, instance.options.to || flowdata.data.to)
                    } 
                ]
            });
            builder.exec(function(err, api_response) {
                flowdata.data = api_response
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
