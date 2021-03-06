# 4b82 - Continuity Trustcenter Framework
## Based on GIT and Merkle Tree

*ps. 4B82 is the first four symbols of the hash value for the GIT empty-tree "tree 0\0" 4b825dc642cb6eb9a060e54bf8d69288fbee4904*

## 4B82 Project Key Technical Details

The goal of this project is to allow a straightforward and robust way to establish abstract, provably immutable sequences of digital events.

Currently existing methods for attaining this rely on highly specialized software, are computationally demanding, or both.

We have decided to use GIT’s architectural framework as the core implementing this functionality because of its versatility, robustness, strong safeguards against corruption, as well as its self-evidential flexibility.

Strict linearity was achieved by leveraging hash functionality typical to all git-like solutions while eschewing branching functionality, and was done in a manner that minimizes unnecessary (for our purposes) overhead of typical git object behaviors (but does not compromise the formal integrity of the git structures involved).

Read more about 4b82 Continuity Trustcenter Framework at [4b82.com](http://4b82.com/#/details)

## How to Use it?

Initialize an empty git repository:

<pre>mkdir git-repo && cd git-repo
git init
cd ..
</pre>

Create the new node.js project:

<pre>mkdir 4b82-server && cd 4b82-server
npm init
</pre>

Add 4b82 code from npm:

<pre>npm install 4b82 --save
</pre>

Now, you can use 4b82 functions and make your own 4b82 server.

## API Functions

Note: all callback functions are `function (err, result)` or `function (err)`. if an error occurs then `err` object will be passed to callback function. Otherwise, `err` object is `null` and `result` object will be passed to the callback function (if result is exists).

### Initialization

First, it is necessary to initialize the application.

During initialization, it is necessary to pass a `configuration object`. Currently, this object is simple and includes a `git` field. This field is an object with the `path` field which stores the path to the GIT repository. For example:

#### Configuration Object

<pre>{
	git: {
		path: 'path-to-git'
	}
}
</pre>

#### Application Initialization

`function init (conf)`

| Arguments | Description                      |
|:--- |:--- |
| `conf`    | Configuration object (see above) |

### Exclusive Access

Before you make any changes to the GIT-repository, you must obtain an exclusive access to GIT-repository at the application level.

**Important**: please, do not forget to call `releaseAccess()` and to release exclusive access to the repository at the end of the operation.

**Important**: exclusive access is provided only at the application logic level, not the system level.

#### Obtain the Exclusive Access

`function getAccess (callback)`

| Arguments | Description |
|:--- |:--- |
| `callback (err)` | Callback function that calls immediately after receiving<br />the exclusive access to the GIT repository |

#### Release the Exclusive Access

`function releaseAccess ()`

| Arguments | Description |
|:--- |:--- |
| *none* | Releases the exclusive access to the GIT repository |

### Adding and Reading Commits

#### Add a Commit to the Repository

`function addCommit (message, author, committer, callback)`

| Arguments | Description |
|:--- |:--- |
| `message` | Commit message |
| `author`  | Commit author |
| `committer` | Committer [(your system)](http://stackoverflow.com/questions/18750808/difference-between-author-and-committer-in-git) |
| `callback (err, commit)` | Callback function that receives commit object after adding or error |

#### Get the Recently Added Commit

`function getRecentCommit (callback)`

| Arguments | Description |
|:--- |:--- |
| `callback (err, commit)` | Callback function that receives commit object after adding or error.<br />If there is no commits, null is returned. |

#### Get the Commit With Hash Value

`function getCommit (hash, callback)`

| Arguments | Description |
|:--- |:--- |
| `hash` | The hash value for the desired commit |
| `callback (err, commit)` | Callback function that receives commit object after adding or error.<br />If there is no commits, null is returned. |

### Display the Commit Data

`function prettyPrint (commit)` - show information about commit

| Arguments | Description |
|:--- |:--- |
| `commit`  | Commit object returned by `addCommit`, `getRecentCommit` or `getCommit` functions |

## Examples

A simple application that adds commit to our fresh 4b82 git repository:

<pre>var _4b82 = require('4b82');

var config = {
	git: { path: '~/git-path/' } // Path to git repository
}

// Initialize 4b82
_4b82.init(config, function (err) {
	if (err) return console.error(err);

	// Get exclusive access to GIT
	_4b82.getAccess(function () {

		// Add commit
		_4b82.addCommit('test commit', 'me &lt;me@localhost>', 'me &lt;me@localhost>',
				function (err, commit) {

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
</pre>

When you run this application it adds new commit to 4b82 git repository and prints the `commit hash`, `data` and `deflated bytes`.

To get specific commit use `getCommit` function:

<pre>// Initialize 4b82
_4b82.init(config, function (err) {
	if (err) return console.error(err);

	// Get commit data
	_4b82.getCommit(hash, function (err, commit) {
		if (err) return console.error(err);

		// Print commit data
		_4b82.prettyPrint(commit);

	})
});
</pre>

This function returns commit object (with tag field).

`commit` contains whole git commit data, you can parse it for author, committer, e.t.c.

`tag` field uses for backward navigation (read more about [backward navigation](http://4b82.com/#/details)).

---

**That's all.**
