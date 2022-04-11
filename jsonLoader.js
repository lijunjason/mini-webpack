export function jsonLoader(source) {
	this.addDeps('添加依赖jsonLoader')
	return `export default ${JSON.stringify(source)}`
}
