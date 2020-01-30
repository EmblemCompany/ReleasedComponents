// #### https://github.com/shrimpy-dev/shrimpy-node
exports.id = 'simple';
exports.title = 'Simple';
exports.group = 'Simple';
exports.color = '#c13333';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'coins';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div class="simpleComponent" data-jc="dropdown" data-jc-path="foo" data-jc-config="datasource:bar;required:true" class="m">@(Select an Exchange)</div>
        </div>
    </div>
</div>
<script>
    var bar = [];
    ON('open.simple', function(component, options) {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        fetch("https://shapeshift.io/onlinecoins", requestOptions)
            .then(response => response.text())
            .then(result => {
                bar = JSON.parse(result);
                FIND('dropdown', function(component) {
                    component.bind('', bar);
                });
            })
            .catch(error => console.log('error', error));
    })
</script>
`;

exports.readme = '60000315409';

exports.install = function(instance) {
    
	instance.on('data', (response) => {
       
            instance.send(response);
    });
};
