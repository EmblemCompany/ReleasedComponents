exports.id = 'getglobalcountbydaterange';
exports.title = 'Get Global Count by Date Range';
exports.group = 'Covid-19';
exports.color = '#002d72';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'disease';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ ];

exports.readme = '60000544122';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="input" data-jc-path="startdate" data-jc-config="type:date;placeholder:Date;format:yyyy-MM-dd;required" class="m">@(Please enter or choose a START date) </div><div class="help"></div>
        </div>
        <div class="col-md-6">
            <div data-jc="input" data-jc-path="enddate" data-jc-config="type:date;placeholder:Date;format:yyyy-MM-dd;required" class="m">@(Please enter or choose an END date) </div><div class="help"></div>
        </div>
    </div>
</div>
`;

exports.install = function(instance) {

    checkConfigure();

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    instance.custom.reconfigure = function() {
        checkConfigure();
    };

    instance.on('options', instance.custom.reconfigure);
    
    function checkConfigure() {
        if (!instance.options.country) {
            instance.status("Not configured", "red");
        } else {
            instance.status('');
        };
    };
    
    async function runIt(flowdata) {

        let data;

        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'https://covidapi.info/api/v1/global/' + instance.options.startdate + '/' + instance.options.enddate,
            'headers': {}
        };

        request(options, function (error, response) { 
            if (error) throw new Error(error);
            data = JSON.parse(response.body);

            flowdata.data = data;

            if (instance.options.downstream) {
                flowdata.set(instance.name, flowdata.data);
            };

            instance.send(flowdata);

        });
    };
};