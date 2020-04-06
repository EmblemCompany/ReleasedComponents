exports.id = 'modifieddiff';
exports.title = 'Modified Diff';
exports.group = 'Logic';
exports.color = '#4e895d';
exports.version = '1.0.1';
exports.input = true;
exports.click = true;
exports.output = 1;
exports.author = 'Shannon Code';
exports.icon = 'crop';

exports.readme = '60000315847';

exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div class="padding">
                <div data-jc="radiobutton" data-jc-path="output" data-jc-config="items:structuredreport|Structured Report,htmlreport|Html Report,list|List of changes;required:true;">Output type</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="padding">
                <div data-jc="checkbox" data-jc-path="debug_output" data-jc-config="">@(Debug Output?) </div>
            </div>
        </div>
    </div>
</div>
<script>
ON('save.modifieddiff', function(component, options) {
    if (options.debug_output) {
        component.output = 2;
    } else {
        component.output = 1;
    }
});</script>
<style>.themedark .ui-radiobutton-selected i, .themedark .ui-radiobutton {color: white !important;border-color:white;}</style>
`;

exports.install = function(instance) {
	var Diff = require('text-diff');
    const stripHtml = require("string-strip-html")
	var diff = new Diff()
	
	var backup = undefined;
	var counter = 0;
	
	instance.on('click', () => {
        checkConfig()
	});
	
	instance.on('data', function(response) {
		doWork(response)
	});

	function doWork(response) {
		var data = response.data;
		if (data instanceof Buffer)
			data = data.toString('base64');
		else if (typeof(data) === 'object' || data instanceof Date)
			data = JSON.stringify(data);
		if (backup !== data) {
			if (!backup) {
				instance.status("First capture", "green")
				backup = data
			} else {
				counter = 0;
				instance.status("Change detected", "green")
				textDiff = diff.main(backup, data)
				diff.cleanupSemantic(textDiff)
				backup = data;
				if (instance.options.downstream) {
					response.set(instance.name, response.data);
				}
				// instance.send2(response);
				if (instance.options.output === "list") {
					instance.send(0,instance.make(textDiff))
				} else {
					var report = diff.prettyHtml(textDiff);
					report = "<style>del {background-color: red;} ins {background-color: green;}</style>" + report
					if (instance.options.output === 'structuredreport') {
						var insertions = textDiff.filter(item=>{ return item[0] === 1})
						var deletions = textDiff.filter(item=>{ return item[0] === -1})
						instance.send(0,instance.make({data: report, insertions: insertions, deletions: deletions, url: instance.options.url || FLOW.variables.url}))
					} else {
						instance.send(0,instance.make(report));
					}
				}
			}
		} else {
			counter++;
			instance.status('Not modified: {0}x'.format(counter));
		}
		if (instance.options.debug_output) {
			instance.send(1, data);
		}
	}

	function checkConfig() {
        backup = undefined;
        counter = 0;
        instance.status("Reset", "green")
    }
};