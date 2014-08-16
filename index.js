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

var getAccess = exports.getAccess = function (callback) {
	if (git.isLocked(config.git.path) || !git.setLock(config.git.path)) {
		return setTimeout(function () { getAccess(callback); }, 100);
	}
	callback();
}

exports.addCommit = function (message, author, committer, callback) {
	git.getHeadMaster(config.git.path, function (err, parent) {
		if (err) return callback(err);
		var obj = git.getCommitData(parent, message, author, committer);
		obj.sha1 = common.sha1(obj.commit);
		common.deflate(obj.commit, function (err, deflated) {
			if (err) return callback(err);
			obj.deflated = deflated;
			git.storeCommit(config.git.path, obj.sha1, deflated, function (err) {
				if (err) return callback(err);
				git.storeTag(config.git.path, parent, obj.sha1, function (err) {
					if (err) return callback(err);
					callback (null, obj);
				});
			});
		});
	});
}

var getCommit = exports.getCommit = function (hash, callback) {
	git.getCommit(config.git.path, hash, function (err, inflated) {
		if (err) return callback(err);
		git.getTag(config.git.path, hash, function (err, tag) {
			if (err) return callback(err);
			var result = {};
			commit = git.parseCommitData(inflated);
			commit.tag = tag;
			callback(null, commit);
		});
	});
}

exports.getRecentCommit = function (callback) {
	git.getHeadMaster(config.git.path, function (err, hash) {
		if (err) return callback(err);
		if (!hash) return callback (null, null); // Git repository is empty
		getCommit(hash, callback); // Else try to get commit
	});
}

exports.releaseAccess = function () {
	git.unsetLock(config.git.path);
}

exports.prettyPrint = function (commit) {
	['tree', 'sha1', 'author', 'committer', 'parent', 'message', 'time', 'commit', 'deflated', 'tag'].forEach(function (entry) {
		if (commit[entry]) {
			var value = commit[entry];
			if (entry == 'deflated') {
				value = commit.deflated.toString('base64');
				console.log(entry + ': ' + value);
			} else if (entry == 'commit') {
				console.log(entry + ":\n\n" + value.trim() + "\n\n----\n");
			} else {
				console.log(entry + ': ' + value);
			}
		}
	});
}
