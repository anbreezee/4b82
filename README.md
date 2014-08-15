#4b82 is the Social TrustCenter Framework
## based on GIT and Merkle Tree

The purpose of the 4B82 Project is providing Social TrustCenter Framework, as well as opportunities to create your own Social TrustCenter, on the basis of modern mathematics and computer science.

We preach the principles of anonymity and security, accessibility and impartiality, respecting for mathematical rigor and providing efficient technologies.

*ps. 4B82 is the first four symbols of the hash value for the GIT empty-tree "tree 0\0" 4b825dc642cb6eb9a060e54bf8d69288fbee4904*

## 4B82 Project Key Technical Details

The goal of this project is to allow a straightforward and robust way to establish abstract, provably immutable sequences of digital events, which can later be later utilized by other developers.

Currently existing methods for attaining this rely on highly specialized software, are computationally demanding, or both.

We have decided to use git’s architectural framework as the core implementing this functionality because of its versatility, robustness, strong safeguards against corruption, as well as its self-evidential flexibility.

Strict linearity was achieved by leveraging hash functionality typical to all git-like solutions while eschewing branching functionality, and was done in a manner that minimizes unnecessary (for our purposes) overhead of typical git object behaviors (but does not compromise the formal integrity of the git structures involved).

Read more about 4b82 at [4b82.com](http://4b82.com/#/details)

## How to use it?

Initialize an empty git repository:

<pre>mkdir git-repo && cd git-repo
git init
cd ..</pre>

Create the new node.js project:

<pre>mkdir 4b82-server && cd 4b82-server
npm init</pre>

Add 4b82 code from npm:

<pre>npm install 4b82 --save</pre>

Now, you can use 4b82 functions and make your own 4b82 server.

For example, let's create a simple application that adds commit to our fresh 4b82 git repository:

<pre>var _4b82 = require('4b82');

var config = {
	git: { path: '~/git-path/' } // Path to git repository
}

// Initialize 4b82
_4b82.init(config, function (err) {
	if (err) return console.error(err);

	// Get sole access to GIT
	_4b82.getAccess(function () {

		// Add commit
		_4b82.addCommit('test commit', 'me <me@localhost>', 'me <me@localhost>', function (err, commit) {
			if (err) return console.error(err);

			// Print commit data
			_4b82.prettyPrint(commit);

			// Release access
			_4b82.releaseAccess();

		});
	});
});
</pre>

When you run this application it adds new commit to 4b82 git repository and returns `commit hash`, `data` and `deflated bytes`.

If you need to get specified commit, you can use function 'getCommit':

<pre>// Initialize 4b82
_4b82.init(config, function (err) {
	if (err) return console.error(err);

	// Get commit data
	_4b82.getCommit(hash, function (err, commit) {
		if (err) return console.error(err);

		// Print commit data
		_4b82.prettyPrint(commit);

	})
});</pre>

This function returns commit object with tag field.

`commit` contains whole git commit data, you can parse it for author, committer, e.t.c.

`tag` field uses for backward navigation.

**That's all.**
