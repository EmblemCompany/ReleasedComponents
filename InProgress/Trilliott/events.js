exports.id = 'events';
exports.title = 'Trilliott Transfer Events';
exports.group = 'Trilliott';
exports.color = '#1E5CAA';
// exports.click = true;
exports.input = false;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'shield';
// exports.brand = true;
exports.version = '0.0.1';
exports.options = {  };

exports.readme = '60000314750';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-6">
			<div data-jc="input" data-jc-path="username" data-jc-config="required" class="m">@(Username)</div>
		</div>
		<div class="col-md-6">
			<div data-jc="input" data-jc-path="password" data-jc-config="type:password;required" class="m">@(Password)</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div data-jc="input" data-jc-path="fromDate" data-jc-config="type:date;placeholder:Date:format;yyyy-MM-dd" class="m">@(Please enter or choose a date)</div><div class="help"></div>
		</div>
		<div class="col-md-3">
			<div data-jc="input" data-jc-path="polling" data-jc-config="type:number" class="m">@(Polling interval in seconds)</div>
			<div class="help"></div>
		</div>
	</div>
</div>
`;

exports.install = function(instance) {

	var subscribed = false;
	const WebSocket = require('ws');

	const ws = new WebSocket('ws://things.trilliott.com/');

	ws.on('open', function open() {
		instance.status("Connected", "green")
		setPolling()
	});

	let authPayload = { "$type": "Request", "method": "post-ws://things.trilliott.com:80/daemons/!/instances/REPLICATOR/", "params": { "$type": "Params", "Credential": "username:password", "Resource": "daemons/123123/instances/F392YLIYXD1J1IQO2OL5" }, "id": "m3dc87wngdhnssnnz2ki" }
	
	let eventPayload = { "$type": "Request", "method": "post-ws://things.trilliott.com/daemons/FNF9DM7VKVCP7NQHZ6SU/instances/REPLICATOR/actions/Fetch/", "id": "F48AWM56AE1J1IQFEN73", "params": { "$type": "Params", "Entity": "Event", "Where": "KindEnum=302" } }
	let credentials = ''
	let pollingTimer = null

	function makeFetchPost(credential) {
		return 'post-ws://things.trilliott.com/daemons/'+credential+'/instances/REPLICATOR/actions/Fetch/'
	}

	function makeUniqueResource() {
		let id = randomString(20, 'hex')
		return "daemons/" + id +"/instances/F392YLIYXD1J1IQO2OL5"
	}

	function setPolling() {
		let loggedin = handleLogin()
		if (loggedin) {
			let timer = (instance.options.polling * 1000) || 10000
			instance.status("Polling - " + timer + " ms", "green")
			clearInterval(pollingTimer);
			pollingTimer = setInterval(toggleSubscribe, timer)
		}
	}

	function handleLogin() { 
		if (!subscribed && instance.options.username && instance.options.password) {
			authPayload.params.Credential = instance.options.username + ":" + instance.options.password
			subscribed = true;
			authPayload.params.Resource = makeUniqueResource()
			authPayload.id = randomString(20, 'hex')
			ws.send(JSON.stringify(authPayload));
			return true
		} else if ((!instance.options.username || !instance.options.password)) { 
			instance.status("Please enter your credentials", "red")
			return false
		} else {
			return true
		}
	}

	ws.on('message', (data) => {
		data = JSON.parse(data)
		if (data.result && data.result.Credential) {
			credentials = data.result.Credential
			eventPayload.method = makeFetchPost(credentials)
			ws.send(JSON.stringify(eventPayload))
		} else {
			if (data.params && data.params.Entities) {
				var flowdata = instance.make()
				flowdata.data = data.params.Entities
				if (instance.options.downstream) {
					flowdata.set(instance.name, flowdata.data);
				}
				instance.send(flowdata)
				instance.options.fromDate = data.params.Entities[data.params.Entities.length - 1].OccurredWhen
			}
		}
		
	});
	
	function toggleSubscribe() {
		if (instance.options.fromDate) {
			let date = instance.options.fromDate
			if (typeof date === "object") {
				date = date.format("yyyy-MM-dd")
			}
			eventPayload.params.Where = "KindEnum=302 AND OccurredWhen > '" + date + "'"
		} else {
			eventPayload.params.Where = "KindEnum=302"
		}
		if (subscribed) {
			ws.send(JSON.stringify(eventPayload));
		} else {
			handleLogin()
		}
	}

	function randomString(length, chars) {
		let mask = '';
		if (chars.indexOf('a') > -1) { mask += 'abcdefghijklmnopqrstuvwxyz'; }
		if (chars.indexOf('A') > -1) { mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
		if (chars.indexOf('hex') > -1) { mask += '0123456789abcdefABCDEF'; }
		if (chars.indexOf('#') > -1) { mask += '0123456789'; }
		if (chars.indexOf('!') > -1) { mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'; }
		let result = '';
		for (let i = length; i > 0; --i) { result += mask[Math.floor(Math.random() * mask.length)]; }
		return result;
	}

	instance.on('options', () => {
		setPolling()
	})
};
