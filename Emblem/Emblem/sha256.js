exports.id = 'sha256';
exports.title = 'SHA-256';
exports.group = 'Emblem Services';
exports.color = '#172F55';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'code-branch';
exports.options = {  };
exports.npm = [];

exports.readme = '0000000000';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textarea" data-jc-path="data" data-jc-config="placeholder:some data">@(data) </div>
            <div class="help">@(Data to hash)</div>
        </div>
    </div>
</div>
`;

exports.install = function(instance) {
    var CryptoJS = require('crypto-js')
	instance.on('data', function(flowdata) {

        var data = replaceTokenizedString(flowdata, instance.options.data || FLOW.variables.data || flowdata.data)
        var hash = CryptoJS.SHA256(data);

        flowdata.data = {hash: hash.toString(CryptoJS.enc.Hex)}
        if (instance.options.downstream) {
            flowdata.set(instance.name, flowdata.data);
        }
        instance.send(flowdata)
    });

    function replaceTokenizedString(response, myString) {
        var tokenRegex = /[^{\}]+(?=})/g
        var replaceArray = myString.match(tokenRegex);
        if (replaceArray) {
            replaceArray.forEach(item=>{
                    objectPath = item.replace('msg.', 'response.data.')
                    myString = myString.replace('{' + item + '}', eval(objectPath))
            })
        }
        return myString
    }
};
