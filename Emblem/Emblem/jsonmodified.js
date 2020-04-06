exports.id = 'jsonmodified';
exports.title = 'JSON Url Modified';
exports.group = 'Files and Data I/O';
exports.color = '#479DED';
exports.input = true;
exports.output = true;
exports.click = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'code-branch';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

exports.readme = '60000650339';

exports.html = `<div class="padding">
<div class="row">
    <div class="col-md-6">
        <div data-jc="textbox" data-jc-path="url" data-jc-config="required:true;">@(Webpage URL) </div>
    </div>
    <div class="col-md-6">
        <div data-jc="textbox" data-jc-path="json" data-jc-config="required:false;">@(JSON Selector) (Optional) </div>
    </div>
</div>
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
ON('save.jsonmodified', function(component, options) {
    if (options.debug_output) {
        component.output = 2;
    } else {
        component.output = 1;
    }
});</script>
<style>.themedark .ui-radiobutton-selected i, .themedark .ui-radiobutton {color: white !important;border-color:white;}</style>
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
    instance.on('click', () => {
        checkConfig(instance.make({}))
        doWork()
    });
    instance.on('data', (flowdata) => {
        doWork(flowdata)
    });

    function doWork(flowdata) {
        request( { uri: instance.options.url || FLOW.variables.url },
            function(error, response, body) {
                var isJson, $, cleaned;
                try {
                    body = JSON.parse(body)
                    isJson = true
                } catch(err) {
                    isJson = false
                }

                if (isJson) {
                    if (instance.options.json || FLOW.variables.json) {
                        var selectors = (instance.options.json || FLOW.variables.json).split('.')
                        var selectorString = ""
                        var prop = "";
                        var bodyString = "";
                        selectors.forEach(item=>{
                            try {
                                var items = eval("body"+selectorString + '["'+item+'"]');
                                if (items) {
                                    selectorString = selectorString + '["'+item+'"]';
                                } else {
                                    prop = item;
                                }
                                
                            } catch(e) {
                                prop = item
                            }
                        })
                        var temp = eval("body" + selectorString)
                        if (Array.isArray(temp) && temp.length > 0 && prop) {
                            temp.forEach(item=>{
                                var location = eval('item.' + prop );
                                bodyString = bodyString + '\r\n' + location;
                            })
                            cleaned = stripHtml(bodyString);
                            // instance.send(1, cleaned);
                        } else {
                            cleaned = stripHtml(JSON.stringify(temp));
                            // instance.send(1, cleaned);
                        }
                    } else {
                        cleaned = stripHtml(JSON.stringify(body));
                        // instance.send(1, cleaned);
                    }
                } else {
                    instance.error("Not JSON");
                    return instance.throw("Not JSON")
                }
                
                if (backup !== cleaned) {
                    if (!backup) {
                        instance.status("First capture", "green")
                        backup = cleaned
                    } else {
                        textDiff = diff.main(backup, cleaned)
                        diff.cleanupSemantic(textDiff)
                        backup = cleaned
                        instance.status("Modification(s) detected", "green")
                        counter = 0
                        if (instance.options.output === "list") {
                            instance.send(0,instance.make(textDiff))
                            if (instance.options.downstream) {
                                flowdata.set(instance.name, flowdata.data);
                            }
                        } else {
                            var report = diff.prettyHtml(textDiff);
                            report = "<style>del {background-color: red;} ins {background-color: green;}</style>" + report
                            if (instance.options.output === 'structuredreport') {
                                var insertions = textDiff.filter(item=>{ return item[0] === 1})
                                var deletions = textDiff.filter(item=>{ return item[0] === -1})
                                instance.send(0, instance.make({data: report, insertions: insertions, deletions: deletions, url: instance.options.url || FLOW.variables.url}))
                            } else {
                                instance.send(0, instance.make(report));
                            }
                            
                        }
                    }
                    

                } else {
                    counter++;
                    instance.status('Not modified: {0}x'.format(counter));
                }
                if (instance.options.debug_output) {
                    instance.send(1,cleaned);
                }
            }
        );
    }

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
            backup = undefined;
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
