var zlib = require('zlib');
var crypto = require('crypto')

exports.stripTrailingSlash = function (str) {
	if (str.substr(-1) == '/') {
		return str.substr(0, str.length - 1);
	}
	return str;
}

exports.deflate = function (data, callback) {
	zlib.deflate(data, function (err, deflated) {
		if (err) callback(err);
		callback(null, deflated);
	});
}

exports.inflate = function (data, callback) {
	zlib.inflate(data, function (err, inflated) {
		if (err) callback(err);
		callback(null, inflated);
	});
}

exports.sha1 = function (data) {
	var shasum = crypto.createHash('sha1');
	shasum.update(data);
	return shasum.digest('hex');
}

exports.getTimestamp = function () {
	var seconds = Math.floor(new Date().getTime() / 1000);
	return { seconds: seconds, timestamp: seconds + ' +0000' };
}

exports.parseTimestamp = function (seconds, offset) {
	var offsetK = (offset.substr(0, 1) == '-') ? 1 : -1;
	var offsetM = parseInt(offset.substr(-2, 2));
	var offsetH = parseInt(offset.substr(-4, 2));
	offset = (offsetH * 60 + offsetM) * offsetK * 60;
	return parseInt(seconds) + offset;
}

var pad = function (number, length) {
	var str = "" + number
	while (str.length < length) str = '0' + str;
	return str;
}
