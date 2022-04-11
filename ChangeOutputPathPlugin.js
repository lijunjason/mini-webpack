export class ChangeOutputPathPlugin {
	apply(hooks) {
		hooks.emitFile.tap('changeOutputPathPlugin', context => {
			context.changeOutputPath('./dist/lijun.js')
			console.log('----changeOutputPathPlugin')
		})
	}
}
