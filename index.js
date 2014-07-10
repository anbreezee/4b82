var common = require('./common');
var git    = require('./git');

var config = {
	git: {
		path: null
	}
};

exports.init = function (conf, callback) {
	if (!conf.git || !conf.git.path) {
		return callback(new Error('Bad config'));
	}
	config.git.path = common.stripTrailingSlash(conf.git.path);
	git.testGitFolder(config.git.path, function (err) {
		if (err) return callback(err);
		return callback(null);
	});
}

var addCommit = exports.addCommit = function (message, author, committer, callback) {
	if (git.isLocked(config.git.path)) {
		setTimeout(function() { addCommit(message, author, committer, callback); }, 100);
	} else {
		if (!git.setLock(config.git.path)) {
			setTimeout(function() { addCommit(message, author, committer, callback); }, 100);
		} else {
			git.getHeadMaster(config.git.path, function (err, parent) {
				if (err) {
					git.unsetLock(config.git.path);
					return callback(err);
				}
				var data = git.getCommitData(parent, message, author, committer);
				var sha1 = common.sha1(data);
				common.deflate(data, function (err, deflated) {
					if (err) {
						git.unsetLock(config.git.path);
						return callback(err);
					}
					git.storeCommit(config.git.path, sha1, deflated, function (err) {
						if (err) {
							git.unsetLock(config.git.path);
							return callback(err);
						}
						git.storeTag(config.git.path, parent, sha1, function (err) {
							if (err) {
								git.unsetLock(config.git.path);
								return callback(err);
							}
							git.unsetLock(config.git.path);
							callback (null, sha1, data, deflated);
						});
					});
				});
			});
		}
	}
}

exports.getCommit = function (hash, callback) {
	git.getCommit(config.git.path, hash, function (err, inflated) {
		if (err) return callback(err);
		git.getTag(config.git.path, hash, function (err, data) {
			var result = { commit: inflated };
			if (!err) result.tag = data;
			callback(null, result);
		});
	});
}
