(function (modules) {
	function require(id) {
		const [fn, mapping] = modules[id];

		const module = {
			exports: {},
		};

		function localRequire(filePath) {
			const id = mapping[filePath];
			return require(id);
		};
		fn(localRequire, module, module.exports);

		return module.exports;
	}

	require(0);
})({ 
     
    
    "0": [ function(require, module, exports) { 
        "use strict";

var _foo = require("./foo.js");

var _user = require("./user.json");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_user2.default);
(0, _foo.test)();
(0, _foo.test)();
console.log('main.js');
console.log('main.js');
    },{"./foo.js":1,"./user.json":2}],
     
    
    "1": [ function(require, module, exports) { 
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = test;

function test() {
  console.log('foo.js');
}
    },{}],
     
    
    "2": [ function(require, module, exports) { 
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\n    \"name\": \"lijun\",\n    \"age\": 25\n}";
    },{}],
     
})
