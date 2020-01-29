exports.id = 'verifyproofs';
exports.title = 'Verify Proofs';
exports.group = 'Chainpoint';
exports.color = '#ff5722';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'link';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

exports.readme = '60000477794';

exports.install = function(instance) {
    const chp = require('chainpoint-client');

	instance.on('data', function(flowdata) {
        runIt(flowdata);
	});
	
	async function runIt(flowdata) {
		if (flowdata.data) {
			let proofs = flowdata.data;
			try {
				let verifiedProofs = await chp.verifyProofs(proofs);
				flowdata.data = verifiedProofs;
			} catch(err) {
				return instance.send({error:"Oops! Something went wrong. Check this out: ", message: err.message});
			}

			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			};
			instance.send(flowdata)
		} else {
			instance.send({error:"We couldn't find any proofs to verify! Check that you are sending a valid proof in from the previous component."});
		};
	};
};
