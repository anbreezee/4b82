var _4b82 = require('4b82');

var config = {
	git: { path: '~/git-path/' }
}

// Initialize 4b82
_4b82.init(config, function (err) {
	if (err) return console.error(err);

	// Get exclusive access to GIT
	_4b82.getAccess(function () {

		// Add commit
		_4b82.addCommit('test commit', 'me <me@localhost>', 'me <me@localhost>', function (err, commit) {
			if (err) {
				_4b82.releaseAccess();
				return console.error(err);
			}

			// Print commit data
			_4b82.prettyPrint(commit);

			// Release access
			_4b82.releaseAccess();

		});
	});
});
