exports.id ="lz_getloggedinuser";
exports.title ="Logzilla Get Currently Logged in User";
exports.group ="Logzilla";
exports.color ="#fc6204";
exports.input =true;
exports.output =1;
exports.version ="0.0.1";
exports.author ="Dawn Code <dawn@unspecified.me>";
exports.icon ="hand-lizard";

exports.readme = '60000318108';

exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textbox" data-jc-path="host" data-jc-config="required:true;placeholder:Logzilla host">@(Host) </div>
            <div class="help">Enter the url for your Logzilla host, such as "demo.logzilla.net". No need to add slashes at the end!</div>
        </div>
    </div>
</div>
`;

exports.install =function(instance) {

    instance.on('data', function (flowdata) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'http://demo.logzilla.net/api/auth/',
            headers:
                {}
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            flowdata.data = JSON.parse(body);
				if (instance.options.downstream) {
                    flowdata.set(instance.name, flowdata.data);
                }
            instance.send(flowdata);
        });

	});

};
