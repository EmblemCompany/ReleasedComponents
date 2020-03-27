exports.id = 'getglobaltimeseriesbyrange';
exports.title = 'Get Global Timeseries Data by Range';
exports.group = 'Covid-19';
exports.color = '#002d72';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'shield-virus';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ ];

exports.readme = '60000633106';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="input" data-jc-path="startdate" data-jc-config="type:date;placeholder:Date;required" class="m">@(Please enter or choose a START date) </div><div class="help"></div>
        </div>
        <div class="col-md-6">
            <div data-jc="input" data-jc-path="enddate" data-jc-config="type:date;placeholder:Date;required" class="m">@(Please enter or choose an END date) </div><div class="help"></div>
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
        if (!instance.options.startdate || !instance.options.enddate) {
            instance.status("Configure me before you use me!", "red");
        } else {
            instance.status('');
        };
    };
    
    async function runIt(flowdata) {

        let data;

        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'https://covidapi.info/api/v1/global/timeseries/' + new Date(instance.options.startdate).format('yyyy-MM-dd') + '/' + new Date(instance.options.enddate).format('yyyy-MM-dd'),
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