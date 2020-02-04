const mysql = require('mysql');

exports.id = 'mysql';
exports.title = 'mySQL Connector';
exports.group = 'File and Data I/O';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'database';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="host" data-jc-config="placeholder:Host name or IP address" class="m">@(Host)</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="user" data-jc-config="placeholder:username for the database" class="m">@(User)</div><div class="help"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="password" data-jc-config="type:password;placeholder:password for the user above" class="m">@(Password)</div><div class="help"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="database" data-jc-config="placeholder:name of the database" class="m">@(Database)</div><div class="help"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textarea" data-jc-path="query" data-jc-config="placeholder:query yo database yo" class="m">@(Query)</div><div class="help"></div>
        </div>
    </div>
</div>
`;

exports.readme = '60000477722';

exports.install = function(instance) {

    instance.on('data', function(flowdata) {
        var connection = mysql.createConnection({
            host     : instance.options.host,
            user     : instance.options.user,
            password : instance.options.password,
            database : instance.options.database
          });
          
        connection.connect();
        
        connection.query(instance.options.query, function (error, results, fields) {
            if (error) throw error;
            flowdata.data = results;

            if (instance.options.downstream) {
                flowdata.set(instance.name, flowdata.data);
            };
            instance.send(flowdata);
        });
        connection.end();
    });
};
