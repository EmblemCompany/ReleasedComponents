exports.id = 'sha256';
exports.title = 'SHA-256 Hash';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.5';
exports.author = 'Shannon Code';
exports.icon = 'code-branch';
exports.options = {  };
exports.npm = [];

exports.readme = '60000403470';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textarea" data-jc-path="data" data-jc-config="placeholder:some data">@(Data) </div>
            <div class="help">@(Data to hash)</div>
        </div>
    </div>
</div>
`;

exports.install = function(instance) {
    var crypto = require('crypto');
    var isBuffer = false;
    var hash = "";
    instance.on('data', (flowdata)=>{
        
        if (flowdata.data && flowdata.data.buffer) {
            if (!Buffer.isBuffer(flowdata.data)) {
                flowdata.data.buffer = Buffer.from(flowdata.data.buffer)
            } else {
                var bfr = flowdata.data
                delete flowdata.data
                flowdata.data = {buffer: bfr}
                // flowdata.data.buffer = flowdata.data
            }
            isBuffer = true
            var shasum = crypto.createHash('sha256');
            shasum.update(flowdata.data.buffer);
            hash = shasum.digest('hex');
        } else {
            hash = crypto.createHash('sha256').update(replaceTokenizedString(flowdata, instance.options.data || flowdata.data.data || flowdata.data)).digest('hex');
        }
        flowdata.data = {isBuffer: isBuffer, hash: hash}
        if (instance.options.downstream) {
            flowdata.set(instance.name, flowdata.data);
        };
        instance.send(flowdata)
    })

    function replaceTokenizedString(response, myString) {
        if (myString === '{msg.data}' && typeof(response.data) === 'object'){
            return JSON.stringify(response.data)
        } else if (response.data.data) {
            try {
                var d = JSON.parse(response.data.data)
                if (typeof(d)==='object') {
                    return response.data.data
                }
            } catch(err){ }            
        }
        
        var tokenRegex = /[^{\}]+(?=})/g
        var replaceArray = myString.match(tokenRegex);
        if (replaceArray) {
            replaceArray.forEach(item=>{
                    objectPath = item.replace('msg.', 'response.data.')
                    console.log(response)
                    myString = myString.replace('{' + item + '}', eval(objectPath))
            })
        }
        return myString
    }
};
