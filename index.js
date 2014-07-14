/**
Copyright (c) 2014, Andrey Breeze (4b82) <anbreezee@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

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
	if (git.isLocked(config.git.path) || !git.setLock(config.git.path)) {
		return setTimeout(function() { addCommit(message, author, committer, callback); }, 100);
	}
	git.getHeadMaster(config.git.path, function (err, parent) {
		if (err) return unsetLockAndReturn(err, callback);
		var data = git.getCommitData(parent, message, author, committer);
		var sha1 = common.sha1(data);
		common.deflate(data, function (err, deflated) {
			if (err) return unsetLockAndReturn(err, callback);
			git.storeCommit(config.git.path, sha1, deflated, function (err) {
				if (err) return unsetLockAndReturn(err, callback);
				git.storeTag(config.git.path, parent, sha1, function (err) {
					if (err) return unsetLockAndReturn(err, callback);
					git.unsetLock(config.git.path);
					callback (null, sha1, data, deflated);
				});
			});
		});
	});
}

var unsetLockAndReturn = function (err, callback) {
	git.unsetLock(config.git.path);
	return callback(err);
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
