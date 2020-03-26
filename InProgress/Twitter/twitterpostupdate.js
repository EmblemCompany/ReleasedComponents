exports.id = 'twitterpostupdate';
exports.title = 'Post an update';
exports.group = 'Twitter';
exports.color = '#479DED';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'twitter';
exports.brand = true;
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

exports.readme = '60000631997';

exports.html = `<div class="padding">
<div class="row">
    <div class="col-md-6">
        <div data-jc="textbox" data-jc-path="twitter_consumer_key" data-jc-config="required:true;type:password;">@(Consumer Key) </div>
    </div>
    <div class="col-md-6">
        <div data-jc="textbox" data-jc-path="twitter_consumer_secret" data-jc-config="required:true;type:password;">@(Consumer Secret) </div>
    </div>
</div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="twitter_access_token_key" data-jc-config="required:true;type:password;">@(Access Token Key) </div>
        </div>
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="twitter_access_token_secret" data-jc-config="required:true;type:password;">@(Access Token Secret) </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textarea" data-jc-path="twitter_body" data-jc-config="placeholder:some data">@(Body) </div>
            <div class="help">@(Tweet body)</div>
        </div>
    </div>
</div>`;

exports.install = function(instance) {
    var Twitter = require('twitter-lite');
    checkConfig();

    instance.on('data', (flowdata) => {
        if ((!FLOW.variables.twitter_body && !instance.options.twitter_body && !flowdata.data.twitter_body)) {
            return instance.status("This component requires tweet body", "red");
        } else {
            instance.status("");
        }
        var data = instance.options.twitter_body || FLOW.variables.twitter_body
        if (data.includes('{msg.')) {
            data = replaceTokenizedString(flowdata, data)
        }
        
        handleTwitter(data, (err, data)=>{

            var flowdata;
            if (err) {
                flowdata = makeFlowData(err)
                err.errors.forEach(error=>{
                    instance.error(error.message);
                })
                return instance.throw(err)
            } else {
                flowdata = makeFlowData(data)
            }
            if(flowdata.data._headers) {
                delete flowdata.data._headers
            }
            if (instance.options.downstream) {
                flowdata.set(instance.name, flowdata.data);
            }
            instance.send(flowdata);
        })
        
    });

    function makeFlowData(data) {
        var flowdata = instance.make(data)
        if(flowdata.data._headers) {
            delete flowdata.data._headers
        }
        return flowdata;
    }

    instance.on('options', ()=>{
        checkConfig();
    })

    function handleTwitter(data, cb) {
        var client = new Twitter({
            consumer_key: FLOW.variables.twitter_consumer_key || instance.options.twitter_consumer_key,
            consumer_secret: FLOW.variables.twitter_consumer_secret || instance.options.twitter_consumer_secret,
            access_token_key: FLOW.variables.twitter_access_token_key || instance.options.twitter_access_token_key,
            access_token_secret: FLOW.variables.twitter_access_token_secret || instance.options.twitter_access_token_secret
          });
          client
            .get("account/verify_credentials")
            .then(results => {
                client.post("statuses/update", {
                    status: data
                })
                .then((response)=>{ return cb(null, response) })
                .catch(err => { return cb(err, null) }) 
            })
    }

    function checkConfig() {
        if (
               (!FLOW.variables.twitter_consumer_key && !instance.options.twitter_consumer_key)
            || (!FLOW.variables.twitter_consumer_secret && !instance.options.twitter_consumer_secret)
            || (!FLOW.variables.twitter_access_token_key && !instance.options.twitter_access_token_key)
            || (!FLOW.variables.twitter_access_token_secret && !instance.options.twitter_access_token_secret)
        ) {
            instance.status("This component requires configuration", "red");
        } else {
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
