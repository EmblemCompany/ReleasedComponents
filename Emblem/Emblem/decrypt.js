exports.id = 'decrypt';
exports.title = 'Decrypt String';
exports.group = 'Emblem Services';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.3';
exports.author = 'Shannon Code';
exports.icon = 'unlock-alt';
exports.options = {  };
exports.npm = [];

exports.readme = '60000315094';

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

exports.install = function(instance) {
    var Crypto = require('crypto-js')
	instance.on('data', function(flowdata) {

        var data = instance.options.data || flowdata.data.encrypted || FLOW.variables.data || flowdata.data
        

        
        var password = instance.options.password || flowdata.data.password || FLOW.variables.password 
        flowdata.data = decrypt(data, password)
        if (instance.options.downstream) {
            flowdata.set(instance.name, flowdata.data);
        }
        instance.send(flowdata)
    });

    function decrypt(data, password) {
        try {
            const decrypted = Crypto.AES.decrypt(data, password).toString(Crypto.enc.Utf8);
            return {decrypted: JSON.parse(decrypted)};
        } catch (exception) {
            return {err: 'Incorrect password or invalid backup file'};
            // console.log('Incorrect password or invalid backup file');
            // throw new Error(exception.message);
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
