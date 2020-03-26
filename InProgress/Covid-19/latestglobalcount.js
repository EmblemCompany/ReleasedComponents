exports.id = 'latestglobalcount';
exports.title = 'Latest Global Count';
exports.group = 'Covid-19';
exports.color = '#002d72';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'viruses';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ ];

exports.readme = '60000632003';

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
            'url': 'https://covidapi.info/api/v1/global',
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