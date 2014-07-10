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
	var offset = new Date().getTimezoneOffset();
	offset = ((offset < 0 ? '+' : '-') + pad(parseInt(Math.abs(offset / 60)), 2) + pad(Math.abs(offset % 60), 2));
	return Math.floor(new Date().getTime() / 1000) + ' ' + offset;
}

var pad = function (number, length) {
	var str = "" + number
	while (str.length < length) str = '0' + str;
	return str;
}