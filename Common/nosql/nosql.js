exports.id = 'nosql';
exports.title = 'NoSQL';
exports.version = '1.2.0';
exports.group = 'Files and Data I/O';
exports.author = 'Martin Smola';
exports.color = '#D770AD';
exports.icon = 'database';
exports.input = true;
exports.output = 2;
exports.options = {};

exports.readme = '60000316040';

exports.html = `
<div class="padding">
	<div data-jc="textbox" data-jc-path="collection" class="m mt10">DB collection name</div>
	<div data-jc="dropdown" data-jc-path="method" data-jc-config="required:true;items:insert,update,read,query,remove" class="m">@(Method)</div>
	<div data-jc="visible" data-jc-path="method" data-jc-config="if:value === 'insert'">
		<div data-jc="checkbox" data-jc-path="addid">Add unique ID to data before insert</div>
	</div>
	<div data-jc="visible" data-jc-path="method" data-jc-config="if:value === 'update'">
		<div data-jc="checkbox" data-jc-path="upsert">Insert document if it doesn't exist</div>
		<div data-jc="checkbox" data-jc-path="upsertid">Add unique ID to data before insert (only if it doesn't exist)</div>
	</div>
</div>`;

exports.install = function(instance) {

	instance.on('data', function(flowdata, next) {
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send2(1, flowdata.clone());

		var options = instance.options;
		var collection = options.collection || flowdata.get('collection');
		if (!collection) {
			flowdata.data = { err: '[DB] No collection specified' };
			next(0, flowdata);
			return instance.error('[DB] No collection specified');
		}

		var nosql = NOSQL(collection);

		if (options.method === 'read') {

			if (!flowdata.data.id) {
				flowdata.data = { err: '[DB] Cannot get record by id: `undefined`' };
				next(0, flowdata);
				return instance.error('[DB] Cannot get record by id: `undefined`');
			}

			nosql.find().make(function(builder) {
				builder.where('id', flowdata.data.id);
				builder.first();
				builder.callback(function(err, response) {
					if (err)
						instance.throw(err);
					else {
						flowdata.data = { response: response };
						next(0, flowdata);
					}
				});
			});

		} else if (options.method === 'insert') {

			options.addid && (flowdata.data.id = UID());
			nosql.insert(flowdata.data).callback(function(err) {
				if (err)
					instance.throw(err);
				else {
					flowdata.data = { success: err ? false : true, id: flowdata.data.id };
					next(0, flowdata);
				}
			});

		} else if (options.method === 'query') {

			var query = flowdata.data;
			nosql.find().make(function(builder) {
				query && query instanceof Array && query.forEach(function(q) {
					if (q instanceof Array) {
						var m = q[0];
						var args = q.splice(1);
						builder[m] && (builder[m].apply(builder, args));
					}
				});
				builder.callback(function(err, response) {
					if (err)
						instance.throw(err);
					else {
						flowdata.data = { response: response || [] };
						next(0, flowdata);
					}
				});
			});

		} else if (options.method === 'update') {

			if (!options.upsert && !flowdata.data.id) {
				flowdata.data = { err: '[DB] Cannot update record by id: `undefined`' };
				next(0, flowdata);
				return instance.error('[DB] Cannot update record by id: `undefined`');
			}

			if (options.upsert && (options.upsertid && !flowdata.data.id))
				flowdata.data.id = UID();

			nosql.modify(flowdata.data, options.upsert).make(function(builder) {
				builder.where('id', flowdata.data.id);
				builder.callback(function(err, count) {
					if (err)
						instance.throw(err);
					else {
						flowdata.data = { response: count || 0 };
						next(0, flowdata);
					}
				});
			});

		} else if (options.method === 'remove') {

			if (!flowdata.data.id) {
				flowdata.data = { err: '[DB] Cannot remove record by id: `undefined`' };
				next(0, flowdata);
				return instance.error('[DB] Cannot remove record by id: `undefined`');
			}

			nosql.remove().make(function(builder) {
				builder.where('id', flowdata.data.id);
				builder.callback(function(err, count) {
					if (err)
						instance.throw(err);
					else {
						flowdata.data = { response: count || 0 };
						next(0, flowdata);
					}
				});
			});
		}
	});
};
