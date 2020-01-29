exports.id ="sendemail";
exports.title ="Send Email";
exports.group = "Messaging";
exports.color ="#00CED1";
exports.input =true;
exports.output =1;
exports.version ="0.0.3";
exports.author ="Shannon Code";
exports.icon ="paper-plane";

exports.readme = '60000315418';

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
        <hr>
        <h3>SMTP server information</h3>
        <div class="row">
            <div class="col-md-6">
                <div data-jc="textbox" data-jc-path="host" data-jc-config="placeholder:Body of the email">@(host) </div>
                <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data" target="_blank">More info here</a></div>
            </div>
            <div class="col-md-6">
                <div data-jc="textbox" data-jc-path="port" data-jc-config="type:number;increment:true;placeholder:587">@(port) </div>
                <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data" target="_blank">More info here</a></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div data-jc="textbox" data-jc-path="username" data-jc-config="placeholder:Email address or SMTP username">@(username) </div>
                    <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data" target="_blank">More info here</a></div>
                </div>
            <div class="col-md-6">
                <div data-jc="textbox" data-jc-path="password" data-jc-config="type:password;placeholder:Email password or SMTP password">@(password) </div>
                    <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data" target="_blank">More info here</a></div>
                </div>
            </div>
        </div>
</div>`

exports.install = function(instance) {

	instance.on('data', function(flowdata) {
        const nodemailer = require("nodemailer");
        async function main() {
            let transporter = nodemailer.createTransport({
                host: instance.options.host,
                port: instance.options.port,
                secure: (instance.options.port === 465) ? true : false, // true for 465, false for other ports
                auth: {
                    user: instance.options.username, 
                    pass: instance.options.password
                }
            });
            
            var to = replaceTokenizedString(flowdata, instance.options.to || FLOW.variables.to || flowdata.data.to);
            var html = replaceTokenizedString(flowdata, instance.options.body || FLOW.variables.body || flowdata.data.body);
            var from = replaceTokenizedString(flowdata, instance.options.from || FLOW.variables.from || flowdata.data.from || '"Circuit Builder" <hello@unspecified.me>');
            var subject = replaceTokenizedString(flowdata, instance.options.subject || FLOW.variables.subject || flowdata.data.subject);
            let info = await transporter.sendMail({
                from: from,
                to: to, 
                subject: subject,
                html: html
            });
            flowdata.data = info
            if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			}
            instance.send(flowdata)
        }

        main().catch(console.error);

        function replaceTokenizedString(response, myString) {
            var tokenRegex = /[^{\}]+(?=})/g
            
            var replaceArray = myString.match(tokenRegex);
            if (replaceArray) {
                replaceArray.forEach(item=>{
                        objectPath = item.replace('msg.', 'response.data.')
                        myString = myString.replace('{' + item + '}', eval(objectPath))
                })
            };
            return myString;
        }
	});
};