import { SyncHook, AsyncParallelHook } from 'tapable'

class List {
	getRoutes() {}
}
class Car {
	constructor() {
		this.hooks = {
			accelerate: new SyncHook(['newSpeed']),
			brake: new SyncHook(),
			calculateRoutes: new AsyncParallelHook(['source', 'target', 'routesList'])
		}
	}

	setSpeed(newSpeed) {
		// following call returns undefined even when you returned values
		this.hooks.accelerate.call(newSpeed)
	}

	useNavigationSystemPromise(source, target) {
		const routesList = new List()
		return this.hooks.calculateRoutes.promise(source, target, routesList).then(res => {
			// res is undefined for AsyncParallelHook
			return routesList.getRoutes()
		})
	}

	useNavigationSystemAsync(source, target, callback) {
		const routesList = new List()
		this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
			if (err) return callback(err)
			callback(null, routesList.getRoutes())
		})
	}
}

// 注册
const myCar = new Car()

// Use the tap method to add a consument
// 同步
myCar.hooks.accelerate.tap('WarningLampPlugin', speed => {
	console.log('acc', speed)
})
// 异步
myCar.hooks.calculateRoutes.tapPromise('test 2', (source, target) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('tapPromise', source, target)
			resolve()
		}, 0)
	})
})
// 触发
myCar.setSpeed(10)

myCar.useNavigationSystemPromise(['1', '2', '3'], 1)
