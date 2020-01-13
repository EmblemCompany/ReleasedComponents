exports.id = 'robinhood';
exports.title = 'Robinhood';
exports.group = 'Robinhood';
exports.color = '#20CF99';
exports.click = true;
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'feather';
exports.version = '1.0.0';
exports.npm = ['robinhood']
exports.options = {  };

exports.html = ``;

exports.readme = `# Robinhood

\`curl 'https://api.robinhood.com/oauth2/token/' -H 'authority: api.robinhood.com' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'x-robinhood-api-version: 1.303.3' -H 'origin: https://robinhood.com' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36' -H 'dnt: 1' -H 'content-type: application/json' -H 'accept: */*' -H 'sec-fetch-site: same-site' -H 'sec-fetch-mode: cors' -H 'referer: https://robinhood.com/login' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' --data-binary '{"grant_type":"password","scope":"internal","client_id":"c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS","expires_in":86400,"device_token":"05e6cdd5-20d1-4bbb-b815-bcf09a5acdc5","username":"xxxxx@gmail.com","password":"xxxxx"}' --compressed\`
`;

exports.install = function(instance) {
	var robinhood = require('robinhood')
	if (!FLOW.get('robinhood')) {
		instance.status('Please authenticate', 'red')
	}
	FLOW.on('message', ()=>{
		alert(0)
	})
	instance.on('click', ()=>{
		RESTBuilder.make(function(builder) {
		builder.url('https://api.robinhood.com/oauth2/token/');
			builder.method('post')
			builder.json({"grant_type":"password","scope":"internal","client_id":"c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS","expires_in":86400,"device_token":"05e6cdd5-20d1-4bbb-b815-bcf09a5acdc5","username":"","password":""});
			builder.exec(function(err, api_response) {
				var response = instance.make(api_response)
				instance.send(response)
				instance.component.click = false;
			})
		})
	})
	instance.on('data', (response)=>{
		/* var credentials = {
			token: '',
			username: 'genecyber@gmail.com',
			password: 'sesufika33'
		}; */
		RESTBuilder.make(function(builder) {
			builder.url('https://api.robinhood.com/oauth2/token/');
			builder.method('post')
			builder.json({"grant_type":"password","scope":"internal","client_id":"c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS","expires_in":86400,"device_token":"05e6cdd5-20d1-4bbb-b815-bcf09a5acdc5","username":"","password":""});
			builder.exec(function(err, response) {
				console.log(err, response)
			})
		})
		var Robinhood = require('robinhood')(credentials, function(){
 
			//Robinhood is connected and you may begin sending commands to the api.
		 
			Robinhood.investment_profile(function(error, api_response, body) {
				if (error) {
					console.error(error);
					// process.exit(1);
				}
				response.data = body
				instance.send(response)
				console.log(body);
			});
		 
		});
	})
};
