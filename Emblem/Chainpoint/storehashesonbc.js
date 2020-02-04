exports.id = 'storehashesonbc';
exports.title = 'Store Hashes on Blockchain';
exports.group = 'Chainpoint';
exports.color = '#ff5722';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'link';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-12 m">
			<div data-jc="textboxlist" data-jc-path="hashes" data-placeholder="@(Type hashes to store here)">@(Hashes) (optional)</div>
			<div class="help">Enter a hash and press Enter</div>
		</div>
	</div>
</div>
`;

exports.readme = '60000477722';

exports.install = function(instance) {
    const chp = require('chainpoint-client');

	instance.on('data', function(flowdata) {
        runIt(flowdata);
	});
	
	async function runIt(flowdata) {
		if (instance.options.hashes || flowdata.data) {
			let incomingData = (instance.options.hashes || flowdata.data);
			if (!Array.isArray(incomingData)) {
				var result = [];
				var keys = Object.keys(incomingData);
				keys.forEach(function(key){
					result.push(incomingData[key]);
				});
				incomingData = result;
			}
			let proofhandles = await chp.submitHashes(incomingData);
			instance.status("Hashes sent! Waiting for 15 seconds to receive response");
            await new Promise(resolve => setTimeout(resolve, 15000));
            let proofs = await chp.getProofs(proofhandles);
            flowdata.data = proofs;

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata);
		} else {
			instance.send({error:"No hashes found! Please enter some in the fields or send some in from an upstream component."});
		};
	};
};
