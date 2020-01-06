exports.id = 'decrypt';
exports.title = 'Decrypt String';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'unlock-alt';
exports.options = {  };
exports.npm = [];
exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="data" data-jc-config="placeholder:some data">@(data) (@(optional))</div>
            <div class="help">@(Data to decrypt)</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="password" data-jc-config="placeholder:some password;type:password">@(password) (@(optional))</div>
            <div class="help">@(Password to use when decrypting)</div>
        </div>
    </div>
</div>
`;

exports.readme = `Decrypt a String

Um, decrypts a string.

## Fields

*Data*: This is the data to decrypt. Only enter data in this field if you are not otherwise sending data to this component from another component (such as *Encrypt String*)

*Password*: Enter a password to be used to encrypt the data, if data was encrypted with a password.

`;

exports.install = function(instance) {
    var Crypto = require('crypto-js')
	instance.on('data', function(flowdata) {
        var data = instance.options.encrypted || flowdata.data.encrypted || FLOW.variables.data 
        if (data.includes('{msg.')) {
            data = replaceTokenizedString(flowdata, data)
        }
        var password = instance.options.password || flowdata.data.password || FLOW.variables.password 
        instance.send(decrypt(data, password))
    });

    function decrypt(data, password) {
        try {
            const decrypted = Crypto.AES.decrypt(data, password).toString(Crypto.enc.Utf8);
            return {decrypted: JSON.parse(decrypted)};
        } catch (exception) {
            console.log('Incorrect password or invalid backup file');
            throw new Error(exception.message);
        }
    }

    function replaceTokenizedString(response, myString) {
        var tokenRegex = /[^{\}]+(?=})/g
        var replaceArray = myString.match(tokenRegex);
        console.log('replaceArray', replaceArray)

        replaceArray.forEach(item=>{
                objectPath = item.replace('msg.', 'response.data.')
                console.log('item', item, objectPath)
        		myString = myString.replace('{' + item + '}', eval(objectPath))
        })
        return myString
    }
};
