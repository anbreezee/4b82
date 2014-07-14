var _4b82 = require('4b82');

var config = {
	git: { path: '../4b82-test/' }
}

_4b82.init(config, function (err) {
	if (err) return console.error(err);
	for (var i = 1; i < 100; i++) {
		addCommit('test commit ' + i, function(){});
	}
});

var addCommit = function (message, callback) {
	_4b82.addCommit(message, 'me <me@localhost>', 'me <me@localhost>', function (err, hash, data, deflated) {
		if (err) return console.error(err);
		console.log('hash: ' + hash);
		console.log('data: ' + data);
		// console.log('deflated: ' + deflated.toString('base64'));
		console.log('----');
		callback();
	})
}
