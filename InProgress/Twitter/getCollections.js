const Twitter = require('node-twitter-api');
// const TwitterClient = new Twitter();

exports.id = 'gettweets';
exports.title = 'Get Tweets';
exports.group = 'Twitter';
exports.version = '0.0.1';
exports.author = 'Stacy Howerton (stacy@unspecified.me)';
exports.color = '#08a0e9';
exports.icon = 'dove';
exports.input = 1;
exports.output = 1;
exports.options = {  };
exports.npm = [];

exports.readme = '00000';

exports.html = `

<div class="padding bg-smoke">
	<section>
		<label><i class="fa fa-lock"></i>@(HTTP basic access authentication)</label>
		<div class="padding npb">
			<div class="row">
				<div class="col-md-6 m">
					<div data-jc="textbox" data-jc-path="username">@(User)</div>
				</div>
				<div class="col-md-6 m">
					<div data-jc="textbox" data-jc-path="userpassword">@(Password)</div>
				</div>
			</div>
		</div>
	</section>
</div>`

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        runIt(flowdata);

        async function main() {
            let tweet = Twitter.getAuth({
                auth: {
                    user: instance.options.username, 
                    pass: instance.options.userpassword
                }
            });
        };
    });
};

 
