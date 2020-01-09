exports.id ="sendemail";
exports.title ="Send Email";
exports.group = "Messaging";
exports.color ="#61affe";
exports.input =true;
exports.output =1;
exports.version ="0.0.2";
exports.author ="Shannon Code";
exports.icon ="paper-plane";

exports.readme = `# Send Email

This component sends an Email using SendGrid.

## Fields

*From*: Enter the email address this email will be from. The format is: ["My Name" <my@email.com>]

*To*: Enter the email address of the intended recipient of this email. This is email address only.

*Subject*: Enter the subject of the email. This can utilize data from the previous component.

*Body*: Enter the body for the email. HTML is supported. If plain text is required, enter only plain text. This can utilize data from the previous component.

## Stuff you need to know

In the *Subject* and *Body* fields, you can retrieve data from the previous component. The Console tab of that component displays the json response. To use that response data, enter {msg.<your json path here>}. 

Learn more [here](https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data)!
`;

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
                <div class="help">To inject data into this field, use {msg.<path>} syntax <a href="https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data">More info here</a></div>
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
        const nodemailer = require("nodemailer");
        async function main() {
            let transporter = nodemailer.createTransport({
                host: "smtp.sendgrid.net",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'apikey', 
                pass: base64Decode('U0cuNmNmaV9xUnpRN1c1amhnZ19kMUstdy5oMVVuOWlmZ2NOSW51bkNwLTdhYUhpTTdmV05EOEJYSW5SMmRZTjZLbEN3')
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
            instance.send(info)
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
        function base64Decode(data) {
            let buff = new Buffer(data, 'base64');
            let text = buff.toString('ascii');
            return text
        }
	});
};