exports.id = 'encrypt';
exports.title = 'Encrypt String';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.3';
exports.author = 'Shannon Code';
exports.icon = 'lock';
exports.options = {  };
exports.npm = [];

exports.readme = `# Encrypt a String

Um, encrypts a string.

## Fields

*Data* (optional): This is the data to encrypt. Only use this field if you are not otherwise sending data to this component from another component (such as the *Random String Generator*)

*Password* (optional): Enter a password to be used to encrypt the data, if desired. If no password is given, it will encrypt with a blank password (not recommended).

`;

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="data" data-jc-config="placeholder:blahblahblahblahblahblahblahblah">@(data) (@(optional))</div>
            <div class="help">Data to encrypt</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="password" data-jc-config="placeholder:some password;type:password">@(password) (@(optional))</div>
            <div class="help">Password to use when encrypting</div>
        </div>
    </div>
</div>
`;

exports.install = function(instance) {
    var Crypto = require('crypto-js')
	instance.on('data', function(flowdata) {
        var data = instance.options.data || flowdata.data.data || FLOW.variables.data 
        if (data.includes('{msg.')) {
            data = replaceTokenizedString(flowdata, data)
        }
        var password = instance.options.password || flowdata.data.password || FLOW.variables.password 
        instance.send(encrypt(data, password))
    });
    
    function encrypt(data, password) {
        try {
            const encrypted = Crypto.AES.encrypt(JSON.stringify(data), password).toString();
            return {encrypted};
        } catch (exception) {
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
