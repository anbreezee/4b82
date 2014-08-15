var _4b82 = require('4b82');

var config = {
	git: { path: '~/git-path/' }
}

var hash = '{insert commit hash here}';

// Initialize 4b82
_4b82.init(config, function (err) {
	if (err) return console.error(err);

	// Get commit data
	_4b82.getCommit(hash, function (err, commit) {
		if (err) return console.error(err);

		// Print commit data
		_4b82.prettyPrint(commit);

	})
});
