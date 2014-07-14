var _4b82 = require('./index');

var config = {
	git: { path: '../4b82-test/' }
}

var hash = '286570ebc97327e47de0b380cbcd5b2b0d57088b';

_4b82.init(config, function (err) {
	if (err) return console.error(err);
	_4b82.getCommit(hash, function (err, result) {
		if (err) return console.error(err);
		console.log('Commit:' + result.commit);
		console.log('Tag: ' + result.tag);
	})
});
