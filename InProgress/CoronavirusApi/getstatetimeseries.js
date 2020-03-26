exports.id = 'getstatetimeseries';
exports.title = 'Get Time Series Data by State';
exports.group = 'CoronavirusApi';
exports.color = '#85515a';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'head-side-cough';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ ];

exports.readme = '60000544122';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="dropdown" data-jc-path="state" data-jc-config="datasource:states;required" class="m">@(State)</div><div class="help"></div>
        </div>
    </div>
</div>
<script>
	var states = [
        {"name":"Alabama","id":"AL"},
        {"name":"Alaska","id":"AK"},
        {"name":"Arizona","id":"AZ"},
        {"name":"Arkansas","id":"AR"},
        {"name":"California","id":"CA"},
        {"name":"Colorado","id":"CO"},
        {"name":"Connecticut","id":"CT"},
        {"name":"Delaware","id":"DE"},
        {"name":"District of Columbia","id":"DC"},
        {"name":"Florida","id":"FL"},
        {"name":"Georgia","id":"GA"},
        {"name":"Hawaii","id":"HI"},
        {"name":"Idaho","id":"ID"},
        {"name":"Illinois","id":"IL"},
        {"name":"Indiana","id":"IN"},
        {"name":"Iowa","id":"IA"},
        {"name":"Kansa","id":"KS"},
        {"name":"Kentucky","id":"KY"},
        {"name":"Lousiana","id":"LA"},
        {"name":"Maine","id":"ME"},
        {"name":"Maryland","id":"MD"},
        {"name":"Massachusetts","id":"MA"},
        {"name":"Michigan","id":"MI"},
        {"name":"Minnesota","id":"MN"},
        {"name":"Mississippi","id":"MS"},
        {"name":"Missouri","id":"MO"},
        {"name":"Montana","id":"MT"},
        {"name":"Nebraska","id":"NE"},
        {"name":"Nevada","id":"NV"},
        {"name":"New Hampshire","id":"NH"},
        {"name":"New Jersey","id":"NJ"},
        {"name":"New Mexico","id":"NM"},
        {"name":"New York","id":"NY"},
        {"name":"North Carolina","id":"NC"},
        {"name":"North Dakota","id":"ND"},
        {"name":"Ohio","id":"OH"},
        {"name":"Oklahoma","id":"OK"},
        {"name":"Oregon","id":"OR"},
        {"name":"Pennsylvania","id":"PA"},
        {"name":"Rhode Island","id":"RI"},
        {"name":"South Carolina","id":"SC"},
        {"name":"South Dakota","id":"SD"},
        {"name":"Tennessee","id":"TN"},
        {"name":"Texas","id":"TX"},
        {"name":"Utah","id":"UT"},
        {"name":"Vermont","id":"VT"},
        {"name":"Virginia","id":"VA"},
        {"name":"Washington","id":"WA"},
        {"name":"West Virginia","id":"WV"},
        {"name":"Wisconsin","id":"WI"},
        {"name":"Wyoming","id":"WY"}
        ];
</script>
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
        if (!instance.options.state) {
            instance.status("Not configured", "red");
        } else {
            instance.status('');
        };
    };

    async function runIt(flowdata) {

        const csv = require("csvtojson");

        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'http://coronavirusapi.com/getTimeSeries/' + instance.options.state,
            'headers': {}
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);

            if (response.body) {
                csv().fromString(response.body).then((jsonObj) => {
                    flowdata.data = jsonObj;
                    if (instance.options.downstream) {
                        flowdata.set(instance.name, flowdata.data);
                    };
                    instance.send(flowdata);
                });
            };
        });
    };
};