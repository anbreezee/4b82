var _4b82 = require('4b82');

var config = {
	git: { path: '~/git-path/' }
}

var hash = '{insert commit hash here}';

_4b82.init(config, function (err) {
	if (err) return console.error(err);
	_4b82.getCommit(hash, function (err, result) {
		if (err) return console.error(err);
		console.log('Commit:' + result.commit);
		console.log('Tag: ' + result.tag);
	})
});
