exports.id = 'code';
exports.title = 'Code';
exports.group = 'Develop and Debug';
exports.color = '#791d12';
exports.input = true;
exports.output = 1;
exports.author = 'Peter Širka';
exports.icon = 'code';
exports.version = '1.2.0';
exports.options = { outputs: 1, code: 'send(0, value);', keepmessage: true };

exports.readme = '60000315425';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="outputs" data-jc-config="type:number;validation:value > 0;increment:true;maxlength:3">@(Number of outputs)</div>
			<div class="help m">@(Minimum is 1)</div>
		</div>
	</div>
	<span class="link expand" style="color:green;float:right;display:none;" onclick="toggle()"><i class="fa fa-arrows-alt"></i></span>
	<div class="ui-codemirror">
		<div class="CodeMirror" id="container" data-jc-path="code" style="width:800px;height:600px;border:1px solid grey"></div>
	</div>
	<!--div-- data-jc="codemirror" data-jc-path="code" data-jc-config="type:javascript;required:true;height:500;tabs:true;trim:true" class="m">@(Code)</!--div-->
	<div data-jc="checkbox" data-jc-path="keepmessage">@(Keep message instance)</div>
	<script src="https://unpkg.com/monaco-editor@0.18.1/min/vs/loader.js"></script>
	
	
</div>
<script>
	
	var code_outputs_count, monaco;

	ON('open.code', function(component, options) {
		code_outputs_count = options.outputs = options.outputs || 1;
		setTimeout(()=>{
			if (!window.monaco) {
				window['require'].config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.18.1/min/vs' } });
				window['require'](['vs/editor/editor.main'], function () {
					var editor = makeEditor(options);
				});
			} else {
				var editor = makeEditor(options);
			}
		}, 1000);
	});

	function makeEditor(options){
		monaco = window.monaco || require('monaco-editor'); // for IntelliSense
		var editor = monaco.editor.create(document.querySelector('#container'), {
			language: "javascript",
			roundedSelection: false,
			scrollBeyondLastLine: false,
			readOnly: false,
			theme: "vs",
			value: options.code,
			automaticLayout: true
		});
		return editor;
	}

	ON('save.code', function(component, options) {
		if (code_outputs_count !== options.outputs) {
			if (flow.version < 511) {
				component.connections = {};
				setState(MESSAGES.apply);
			}
			component.output = options.outputs || 1;
		}
	});

	ON('close', function() {
		editor.detach();
	});

	var container, header, editor, parent, html, expand = '';
	var mode = "minimized";
	setTimeout(()=>{
		container = $(".ui-codemirror");
		header = $(".ui-modal-header");
		editor = $(".CodeMirror");
		parent = $(".ui-modal-visible");
		html = $('div[data-jc-id="html.code"]');
		expand = $(".link.expand");
		expand.show();
		console.log("loaded", container, header, editor, parent, html, expand);
	}, 2000);
	

	function fullscreen(){
		expand.detach();
		header.prepend(expand);
		header.appendTo(parent);
		editor.appendTo(parent);
		expand.find("i").removeClass("fa-arrows-alt");
		expand.find("i").addClass("fa-compress-arrows-alt");
		expand.css("line-height", "50px");
		editor.css("width", "100%");
		expand.css("padding-right", "5px");
		parent.css("padding","25px");
		editor.css("height","95%");
		html.hide();
		mode = "fullscreen";
	}

	function restore() {
		expand.detach();
		editor.detach();
		html.prepend(header);
		editor.appendTo(container);
		editor.css("height", "unset");
		expand.find("i").removeClass("fa-compress-arrows-alt");
		expand.find("i").addClass("fa-arrows-alt");
		expand.css("line-height","unset");
		expand.insertBefore(editor.parent().parent());
		html.show();
		mode = "minimized";
	}

	function toggle() {
		if (mode === "minimized") {
			fullscreen();
		} else {
			restore();
		}
	}
</script>`;

exports.install = function(instance) {

	var fn;

	instance.on('data', function(response) {
		if (fn) {
			try {
				fn(response.data, instance, response, instance.options, response.repository, require);
			} catch (e) {
				response.data = e;
				instance.throw(response);
			}
		}
	});

	instance.reconfigure = function() {
		try {
			if (instance.options.code) {
				instance.status('');
				var code = 'var send = function(index, value) { if (options.keepmessage) { if (instance.options.downstream) { flowdata.set(instance.name, value); } flowdata.data = value; instance.send2(index, flowdata); } else instance.send2(index, value);}; var error = function(err) { instance.throw(err); }; ' + instance.options.code;
				fn = new Function('value', 'instance', 'flowdata', 'options', 'repository', 'require', code);
			} else {
				instance.status('Configure me before you use me!', 'red');
				fn = null;
			}
		} catch (e) {
			fn = null;
			instance.error('Code: ' + e.message);
		}
	};

	instance.on('options', instance.reconfigure);
	instance.reconfigure();
};