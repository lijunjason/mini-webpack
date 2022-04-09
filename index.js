import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'

function createAsset() {
	// 1. 获取文件内容
	const source = fs.readFileSync('./example/main.js', { encoding: 'utf-8' })

	// 2. 获取依赖关系
	// ast -> 抽象语法树
	const ast = parser.parse(source, {
		sourceType: 'module'
	})
	const deps = []
	traverse.default(ast, {
		ImportDeclaration({ node }) {
			deps.push(node.source.value)
		}
	})
	return {
		source,
		deps
	}
}
const asset = createAsset()
console.log(asset)
