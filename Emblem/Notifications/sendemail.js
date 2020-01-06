exports.id ="sendemail";
exports.title ="Send Email";
exports.group ="Notifications";
exports.color ="#61affe";
exports.input =true;
exports.output =1;
exports.version ="0.0.1";
exports.author ="Shannon Code";
exports.icon ="paper-plane";
exports.options ={};
exports.npm =['nodemailer'];


exports.readme = `# Send Email

This component sends an SMS message using ClickSend.

## Fields

\`msg\`: Enter the message that will go into the SMS here.\`

\`to\`: Enter the phone number for the recipient here. This 
needs to be in the E.164 standard format, which looks like the following: +[country code][subscriber number]. An example US phone number would be +18888511920.

## Stuff you need to know

In the \`msg\` field, you can retrieve data from the previous component. The Console tab of that component displays the json response. To use that response data, enter {message.<your json path here>}. For example, in this template, {message.response.balance} retrieves the balance from Emblem: Get Dynamic Coin Balance. 

Learn more [here](https://bit.ly/2FbjaOB)!
`;

exports.html = `<div class="padding">
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="from" data-jc-config="placeholder:Enter the text of your message here">@(from) </div>
                <div class="help">Format: "My Name" &lt;my@email.com&gt; </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="to" data-jc-config="placeholder:Recipient email">@(to) </div>
                <div class="help"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="subject" data-jc-config="placeholder:Subject of your email">@(subject) </div>
                <div class="help"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div data-jc="textbox" data-jc-path="body" data-jc-config="placeholder:Body of the email">@(body) </div>
                <div class="help"></div>
            </div>
        </div>
</div>`

exports.install = function(instance) {

	instance.on('data', function(flowdata) {
        // "use strict";
        const nodemailer = require("nodemailer");

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.sendgrid.net",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'apikey', 
                pass: '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'
                }
            });

            // send mail with defined transport object
            var to = replaceTokenizedString(flowdata, instance.options.to || FLOW.variables.to || flowdata.data.to)
            // console.log("to", to)
            let info = await transporter.sendMail({
                from: replaceTokenizedString(flowdata, instance.options.from || FLOW.variables.from || flowdata.data.from || '"Circuit Builder" <hello@unspecified.me>'), // sender address
                to: to, // list of receivers
                subject: replaceTokenizedString(flowdata, instance.options.subject || FLOW.variables.subject || flowdata.data.subject), // Subject line
                // text: instance.options.text || FLOW.variables.text || flowdata.text, // plain text body
                html: replaceTokenizedString(flowdata, instance.options.body || FLOW.variables.body || flowdata.data.body) // html body
            });
            // console.log("info", info)
            instance.send(info)
        }

        main().catch(console.error);

        function replaceTokenizedString(response, myString) {
            var tokenRegex = /[^{\}]+(?=})/g
            
            var replaceArray = myString.match(tokenRegex);
            // console.log('myString', myString, "arr", replaceArray)
            if (replaceArray) {
                replaceArray.forEach(item=>{
                        objectPath = item.replace('msg.', 'response.data.')
                        // console.log("objectPath", objectPath, "to replace", "{" + item + "}", "eval" , eval(objectPath), "myString", myString)
                        myString = myString.replace('{' + item + '}', eval(objectPath))
                        // console.log("Replaced!", myString)
                })
            };
            return myString;
        }
	});
};