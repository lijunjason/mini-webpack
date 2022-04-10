;(function (modules) {
	function require(id) {
		const [fn, mapping] = modules[id]

		const module = {
			exports: {}
		}

		function localRequire(filePath) {
			const id = mapping[filePath]
			return require(id)
		}
		fn(localRequire, module, module.exports)

		return module.exports
	}

	require(0)
})({
	0: [
		function (require, module, exports) {
			'use strict'

			var _foo = require('./foo.js')

			;(0, _foo.test)()
			;(0, _foo.test)()
			console.log('main.js')
			console.log('main.js')
		},
		{ './foo.js': 1 }
	],

	1: [
		function (require, module, exports) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})
			exports.test = test

			function test() {
				console.log('foo.js')
			}
		},
		{}
	]
})
