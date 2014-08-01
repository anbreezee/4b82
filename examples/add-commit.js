var _4b82 = require('4b82');

var config = {
	git: { path: '~/git-path/' }
}

var totalCommits = 100;

_4b82.init(config, function (err) {
	if (err) return console.error(err);
	for (var i = 0; i < totalCommits; i++) {
		addCommit('test commit ' + i, function(){
			_4b82.unsetLock();
		});
	}
});

var addCommit = function (message, callback) {
	_4b82.addCommit(message, 'me <me@localhost>', 'me <me@localhost>', function (err, commit) {
		if (err) return console.error(err);
		console.log('tree: '      + commit.tree);
		console.log('sha1: '      + commit.sha1);
		console.log('author: '    + commit.author);
		console.log('committer: ' + commit.committer);
		console.log('parent: '    + commit.parent);
		console.log('message: '   + commit.message);
		console.log('time: '      + commit.time);
		console.log('commit: '    + commit.commit);
		console.log('deflated: '  + commit.deflated.toString('base64'));
		console.log('----');
		callback();
	})
}
