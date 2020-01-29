exports.id ="email_vault_sendemail";
exports.title ="Email Vault Template Send Email";
exports.group = "Template Components";
exports.color ="#00CED1";
exports.input =true;
exports.output =1;
exports.version ="0.0.4";
exports.author ="Shannon Code";
exports.icon ="paper-plane";

exports.readme = '60000318223';

exports.html = `<div class="padding">
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="from" data-jc-config="placeholder:Who is this email coming from?">@(from) </div>
                <div class="help">Format: "My Name" &lt;my@email.com&gt; </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="to" data-jc-config="placeholder:Recipient email address">@(to) </div>
                <div class="help"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="subject" data-jc-config="placeholder:Subject of the email">@(subject) </div>
                <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data" target="_blank">More info here</a></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textarea" data-jc-path="body" data-jc-config="placeholder:Body of the email">@(body) </div>
                <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data" target="_blank">More info here</a></div>
            </div>
        </div>
</div>`

exports.install = function(instance) {

	instance.on('data', function(flowdata) {
        
            var to = replaceTokenizedString(flowdata, instance.options.to || FLOW.variables.to || flowdata.data.to);
            var html = replaceTokenizedString(flowdata, instance.options.body || FLOW.variables.body || flowdata.data.body);
            var from = replaceTokenizedString(flowdata, instance.options.from || FLOW.variables.from || flowdata.data.from || '"Circuit Builder" <hello@unspecified.me>');
            var subject = replaceTokenizedString(flowdata, instance.options.subject || FLOW.variables.subject || flowdata.data.subject);
            
            RESTBuilder.make(function(builder) {
                builder.url('https://api.emblemvault.io/mailjet');
                builder.method('post');
			    builder.header('service', 'cbproxy');
                builder.json({to: to, html: html, from: from, subject: subject});
                builder.exec(function(err, api_response) {
                    flowdata.data = api_response
                    if (instance.options.downstream) {
                        flowdata.set(instance.name, flowdata.data);
                    }
                    instance.send(flowdata)
                })
            })

        function replaceTokenizedString(response, myString) {
            var tokenRegex = /[^{\}]+(?=})/g
            
            var replaceArray = myString.match(tokenRegex);
            if (replaceArray) {
                replaceArray.forEach(item=>{
                        objectPath = item.replace('msg.', 'response.data.');
                        myString = myString.replace('{' + item + '}', eval(objectPath));
                })
            };
            return myString;
        }
	});
};