var fs     = require('fs');
var common = require('./common');

var treeHash = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

//--------------------------------------------------

var getPathToGitRoot = function (pathToGit) {
	return pathToGit + '/.git';
}

var getLockFile = function (pathToGit) {
	return getPathToGitRoot(pathToGit) + '/4b82.lock';
}

var getPathToHeadMaster = function (pathToGit) {
	return getPathToGitRoot(pathToGit) + '/refs/heads/master';
}

var getPathToObjectDir = function (pathToGit, hash) {
	return getPathToGitRoot(pathToGit) + '/objects/' + hash.substr(0, 2);
}

var getPathToObject = function (pathToGit, hash) {
	return getPathToObjectDir(pathToGit, hash) + '/' + hash.substr(2);
}

var getPathToTag = function (pathToGit, hash) {
	return getPathToGitRoot(pathToGit) + '/refs/tags/' + hash;
}

//--------------------------------------------------

exports.testGitFolder = function (pathToGit, callback) {
	path = getPathToGitRoot(pathToGit);
	fs.exists(path, function (exists) {
		if (!exists) return callback(new Error('Git not found'));
		callback(null);
	})
}

//--------------------------------------------------

var getEmptyTreeData = function () {
	return "tree 0\0";
}

exports.getCommitData = function (parent, message, author, committer) {
	var commit = 'tree ' + treeHash + "\n";
	var time = common.getTimestamp();

	if (parent)    commit += 'parent ' + parent + "\n";
	if (author)    commit += 'author ' + author + ' ' + time + "\n";
	if (committer) commit += 'committer ' + committer + ' ' + time + "\n";
	if (message)   commit += "\n" + message + "\n";

	commit = 'commit ' + commit.length + "\0" + commit;

	return {
		tree: treeHash,
		author: author,
		committer: committer,
		parent: parent,
		message: message,
		time: time,
		commit: commit
	};
}

exports.parseCommitData = function (data) {
	data = data.split("\n");
	var commit = {};

	while (data.length > 0) {
		var row = data.shift().trim();
		if (row.length == 0) break; // Git header ends

		var pices = row.split(' ');
		var elm = pices.shift();
		var val = pices.join(' ');

		var allowable = ['tree', 'parent', 'author', 'committer'];
		if (allowable.indexOf(elm) > -1) {
			commit[elm] = val.trim();
		}
	}

	// skip empty lines
	while (data.length > 0) {
		if (data[0].trim().length != 0) break;
		data.shift().trim();
	}

	if (data.length > 0) {
		commit.message = data.join("\n").trim();
	}

	return commit;
}

//--------------------------------------------------

exports.getHeadMaster = function (pathToGit, callback) {
	path = getPathToHeadMaster(pathToGit);
	fs.exists(path, function (exists) {
		if (!exists) {
			initEmptyGit(pathToGit, function (err) {
				if (err) return callback(err);
				return callback(null, null);
			});
		} else {
			fs.readFile(path, 'utf8', function (err, data) {
				if (err) return callback(err);
				return callback(null, data.trim());
			})
		}
	})
}

var initEmptyGit = function (pathToGit, callback) {
	var data = getEmptyTreeData();
	var sha1 = common.sha1(data);
	common.deflate(data, function (err, deflated) {
		if (err) return callback(err);
		storeCommit(pathToGit, sha1, deflated, function (err) {
			if (err) return callback(err);
			return callback(null);
		});
	});
}

//--------------------------------------------------

var storeCommit = exports.storeCommit = function (pathToGit, hash, deflated, callback) {
	var pathToObjectDir = getPathToObjectDir(pathToGit, hash);
	var pathToObject = getPathToObject(pathToGit, hash);
	var pathToHeadMaster = getPathToHeadMaster(pathToGit);

	fs.exists(pathToObjectDir, function (exists) {
		if (!exists) fs.mkdirSync(pathToObjectDir);
		fs.exists(pathToObject, function (exists) {
			if (exists) return callback(new Error('Commit already exists'));
			fs.writeFile(pathToObject, deflated, function (err) {
				if (err) return callback(err);
				fs.writeFile(pathToHeadMaster, hash, function (err) {
					if (err) return callback(err);
					return callback(null);
				});
			});
		});
	});
}

exports.getCommit = function (pathToGit, hash, callback) {
	var pathToObject = getPathToObject(pathToGit, hash);
	fs.exists(pathToObject, function (exists) {
		if (!exists) return callback(new Error('Commit not found'));
		fs.readFile(pathToObject, function (err, deflated) {
			if (err) return callback(err);
			common.inflate(deflated, function (err, inflated) {
				if (err) return callback(err);
				return callback(null, inflated.toString('utf8'));
			})
		})
	});
}

exports.storeTag = function (pathToGit, parentHash, childHash, callback) {
	if (!parentHash) return callback(null);
	var pathToTag = getPathToTag(pathToGit, parentHash);
	fs.exists(pathToTag, function (exists) {
		if (exists) return callback(new Error('Tag already exists'));
		fs.writeFile(pathToTag, childHash, function (err) {
			if (err) return callback(err);
			return callback(null);
		});
	});
}

exports.getTag = function (pathToGit, hash, callback) {
	var pathToTag = getPathToTag(pathToGit, hash);
	fs.exists(pathToTag, function (exists) {
		if (!exists) return callback(null, null);
		fs.readFile(pathToTag, 'utf8', function (err, data) {
			if (err) return callback(err);
			return callback(null, data);
		});
	});
}

//--------------------------------------------------

var isLocked = exports.isLocked = function (pathToGit) {
	var pathToLock = getLockFile(pathToGit);
	return fs.existsSync(pathToLock);
}

exports.setLock = function (pathToGit) {
	var pathToLock = getLockFile(pathToGit);
	if (isLocked(pathToGit)) return false;
	fs.writeFileSync(pathToLock, '1');
	return isLocked(pathToGit);
}

exports.unsetLock = function (pathToGit) {
	var pathToLock = getLockFile(pathToGit);
	fs.unlinkSync(pathToLock);
	return true;
}
