exports.id = 'getglobaldatewisecount';
exports.title = 'Get Global Datewise Count';
exports.group = 'Covid-19';
exports.color = '#002d72';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'hand-holding-medical';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ ];

exports.readme = '60000633128';

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });
    
    async function runIt(flowdata) {

        let data;

        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'https://covidapi.info/api/v1/global/count',
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