exports.id = 'encrypt';
exports.title = 'Encrypt String';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.5';
exports.author = 'Shannon Code';
exports.icon = 'lock';
exports.options = {  };
exports.npm = [];

exports.readme = '60000315104';

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
        
        if (!data || !password) {
            if (!data) {
                instance.status('Please supply soem data to encrypt','red')
                instance.error('No data was supplied. Please supply data to encrypt in the componnet settings, incoming data, or global variables')
            }
            if (!password) {
                instance.status('Please supply a password to encrypt with','red')
                instance.error('No password was supplied. Please supply a password in the componnet settings, incoming data, or global variables')
            }
        } else {
            instance.status('')
        }
        

        flowdata.data = encrypt(data, password)
        if (instance.options.downstream) {
            flowdata.set(instance.name, flowdata.data);
        }
        instance.send(flowdata)
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
