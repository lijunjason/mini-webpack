import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from 'babel-core'
import { jsonLoader } from './jsonLoader.js'
import { SyncHook, AsyncParallelHook } from 'tapable'

import { ChangeOutputPathPlugin } from './ChangeOutputPathPlugin.js'

let id = 0

const webpackConfig = {
	module: {
		rules: [
			{
				test: /\.json$/,
				use: [jsonLoader]
			}
		]
	},
	plugins: [new ChangeOutputPathPlugin()]
}
const hooks = {
	emitFile: new SyncHook(['context'])
}
/**
 * @method createAsset
 * @description 创建
 */
function createAsset(filePath) {
	// 1. 获取文件内容
	let source = fs.readFileSync(filePath, { encoding: 'utf-8' })

	// initLoader
	const loaders = webpackConfig.module.rules
	const loaderContext = {
		addDeps(dep) {
			console.log('addDeps', dep)
		}
	}
	loaders.forEach(({ test, use }) => {
		if (test.test(filePath)) {
			if (Array.isArray(use)) {
				use.reverse().forEach(fn => {
					source = fn.call(loaderContext, source)
				})
			} else {
				source = use(source)
			}
		}
	})

	// 2. 获取依赖关系
	// ast -> 抽象语法树
	const ast = parser.parse(source, {
		sourceType: 'module'
	})
	const deps = []
	// 获取ast中的value
	traverse.default(ast, {
		ImportDeclaration({ node }) {
			deps.push(node.source.value)
		}
	})

	const { code } = transformFromAst(ast, null, {
		presets: ['env']
	})

	return {
		filePath,
		code,
		deps,
		mapping: {},
		id: id++
	}
}
/**
 * @method createGraph
 * @description 根据文件和依赖关系创建图
 */
function createGraph() {
	const mainAsset = createAsset('./example/main.js')

	const queue = [mainAsset]

	for (const asset of queue) {
		asset.deps.forEach(relativePath => {
			const child = createAsset(path.resolve('./example', relativePath))
			asset.mapping[relativePath] = child.id
			queue.push(child)
		})
	}
	return queue
}

function initPlugins() {
	const plugins = webpackConfig.plugins
	plugins.forEach(p => {
		p.apply(hooks)
	})
}
initPlugins()
const graph = createGraph()

/**
 * @method build
 * @description 构建函数
 */
function build(graph) {
	const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' })

	const data = graph.map(asset => {
		const { id, code, mapping } = asset
		return {
			id,
			code,
			mapping
		}
	})
	const code = ejs.render(template, { data })

	let outputPath = './dist/bundle.js'
	const context = {
		changeOutputPath(path) {
			outputPath = path
		}
	}
	// 触发
	hooks.emitFile.call(context)
	fs.writeFileSync(outputPath, code)
}

build(graph)
