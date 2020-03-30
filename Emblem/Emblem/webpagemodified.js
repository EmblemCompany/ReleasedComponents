exports.id = 'webpagemodified';
exports.title = 'Webpage Modified';
exports.group = 'Files and Data I/O';
exports.color = '#479DED';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'atlas';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

exports.readme = '60000641472';

exports.html = `<div class="padding">
<div class="row">
    <div class="col-md-6">
        <div data-jc="textbox" data-jc-path="url" data-jc-config="required:true;">@(Webpage URL) </div>
    </div>
    <div class="col-md-6">
        <div data-jc="textbox" data-jc-path="selector" data-jc-config="required:false;">@(jQuery Selector) (Optional) </div>
    </div>
</div>
    <div class="row">
        <div class="col-md-12">
            <div class="padding">
                <div data-jc="radiobutton" data-jc-path="output" data-jc-config="items:structuredreport|Structured Report,htmlreport|Html Report,list|List of changes;required:true;">Output type</div>
            </div>
        </div>
    </div>
</div>
<style>.themedark .ui-radiobutton-selected i, .themedark .ui-radiobutton {color: white !important;border-color:white;}</style>
<script>var outputtypes = ['Total.js', 'express', 'Hapi', 'Koa', 'Sails'];</script>
`;

exports.install = function(instance) {
    var request = require('request');
    var cheerio = require('cheerio');
    var Diff = require('text-diff');
    const stripHtml = require("string-strip-html")
    var diff = new Diff()
    const fs = require('fs')
    checkConfig();

    var backup = undefined;
    var counter = 0;
    
    instance.on('data', (flowdata) => {
        request( { uri: instance.options.url || FLOW.variables.url },
            function(error, response, body) {
                var $ = cheerio.load(body);
                var cleaned
                try {
                    cleaned = stripHtml($(instance.options.selector || FLOW.variables.selector || 'body').html())
                } catch(err){
                    instance.error(err.message);
                    return instance.throw(err)
                }
                if (backup !== cleaned) {
                    if (!backup) {
                        instance.status("First capture", "green")
                        return backup = cleaned
                    } else {
                        textDiff = diff.main(backup, cleaned)
                        diff.cleanupSemantic(textDiff)
                        backup = cleaned
                        instance.status("Modification(s) detected", "green")
                        counter = 0
                        if (instance.options.output === "list") {
                            instance.send(instance.make(textDiff))
                            if (instance.options.downstream) {
                                flowdata.set(instance.name, flowdata.data);
                            }
                        } else {
                            var report = diff.prettyHtml(textDiff);
                            report = "<style>del {background-color: red;} ins {background-color: green;}</style>" + report
                            if (instance.options.output === 'structuredreport') {
                                var insertions = textDiff.filter(item=>{ return item[0] === 1})
                                var deletions = textDiff.filter(item=>{ return item[0] === -1})
                                instance.send(instance.make({data: report, insertions: insertions, deletions: deletions, url: instance.options.url || FLOW.variables.url}))
                            } else {
                                instance.send(instance.make(report));
                            }
                            
                        }
                    }
                    

                } else {
                    counter++;
                    instance.status('Not modified: {0}x'.format(counter));
                }
            }
        );
        
    });

    instance.on('options', ()=>{
        checkConfig();
    })

    function checkConfig() {
        backup = undefined;
        counter = 0;
        if (
               (!FLOW.variables.url && !instance.options.url)
            || (!FLOW.variables.output && !instance.options.output)
        ) {
            instance.status("Configure me before you use me!", "red");
        } else {
            var backup = undefined;
            instance.status("");
        }
    }

    function replaceTokenizedString(response, myString) {
		var tokenRegex = /[^{\}]+(?=})/g
		console.log(typeof(myString))
		if (typeof(myString) === "object") {
			var arr = []
			myString.forEach(string=>{
				arr.push(replace(string));
			})
			return arr;
		} else {
			return replace(myString);
		}
		function replace(myString){
			var replaceArray = myString.match(tokenRegex);
			if (replaceArray) {
				replaceArray.forEach(item=>{
						objectPath = item.replace('msg.', 'response.data.')
						myString = myString.replace('{' + item + '}', eval(objectPath))
				})
			}
			return myString
		}        
    }
};
