var __MILLISEC__ = 1000
/**
 * say something ...
 * 参数1 如果是数字到话，那就只是单纯到sleep了。不计算后续所有
 * 参数1 如果是字符串的话，那就是选择器。
 * 参数1 如果是函数的话，那就是表达式，期望返回Boolean true/false
 * 参数2 如果是数字的话,那就是最大等待到时间
 * 参数2 如果是数字字符串的话，那也是最大等待时间
 * 参数2 如果是函数到话，那就是回调函数，并且没有期待等待时间，就是无限循环

 * 参数2 如果是函数到话，那就是回调函数。那参数3只能是最大等待时间，也就数字
 * 只要参数有问题的话不说就说throw
 * 现在先实现循环吧。只要循环成立就可以了。
 * 还需要构思全局参数，配置一个遍历频率，譬如默认1000毫秒
 * 还可以通过wait拓展出各种语法糖函数
 * 应该支持停止功能，也就是把setT放在全局__TIMER__可以随时去clear它
 * 第一个参数应该支持dom object
 */
function wait () {
	// 只有一个参数的情况，那么只能是数字，或者是函数（Boolean），也能是字符串（选择器）
	if (arguments.length === 1) {
		// 获取第一个参数
		var args1 = Array.prototype.shift.call(arguments)

		// 如果第一个参数是数字的话
		if (+args1 == args1) {
			// 防止非法参数
			if (args1 <= 50) args1 = __MILLISEC__
			// sleep，随便返回点什么东西，甚至不返回东西也没关系。我这里直接返回true了
			return new Promise(resolve => {
				setTimeout(() => resolve(true), args1);
			})
		}

		// 如果第一个参数是字符串的话，那就是选择器了
		if (typeof args1 === 'string') {
			var dom = document.querySelectorAll(args1);
			// 如果有的话就立即返回吧
			if (dom.length > 0) return dom
			return new Promise(resolve => {
				(function () {
					dom = document.querySelectorAll(args1)
					if (document.querySelectorAll(args1).length > 0) {
						// 返回dom
						return resolve(dom)
					} else {
						console.log('no');
						setTimeout(() => {
							arguments.callee()
						}, __MILLISEC__)
					}
				}());
			})
		}

		// 如果第一个参数是函数的话
		if (typeof args1 === 'function') {
			// 先执行一下函数（有可能执行报错，考虑加入try catch）
			var bool = args1(document.querySelectorAll);
			// 必须返回Boolean类型
			if (bool === true || bool === false) {
				// 如果直接为true了就返回吧。别浪费时间了
				if (bool === true) return true
				return new Promise(resolve => {
					(function () {
						if (args1(document.querySelectorAll)) {
							// 随便返回点什么东西，甚至不返回东西也没关系。我这里直接返回true了
							return resolve(true)
						} else {
							console.log('no');
							setTimeout(() => {
								arguments.callee()
							}, __MILLISEC__)
						}
					}());
				})
			} else {
				throw new Error('函数必须返回Boolean类型')
			}
		}
		
	} else if (arguments.length === 2) {
		// 获取第一个参数
		var args1 = Array.prototype.shift.call(arguments)
		// 获取第二个参数
		var args2 = Array.prototype.shift.call(arguments)	

		// 参数1为字符串，参数2为数字的时候才执行
		if (typeof args1 === 'string' && +args2 == args2) {
			// 获取元素节点
			var dom = document.querySelectorAll(args1);
			// 如果有的话就立即返回吧
			if (dom.length > 0) return dom
			return new Promise(resolve => {
				// 这里改用 setInterval
				var timer = setInterval(() => {
					if (document.querySelectorAll(args1).length > 0) {
						clearInterval(timer)
						// 返回dom
						return resolve(document.querySelectorAll(args1))
					}
				}, 1000);	
				// 几秒之后就取消
				setTimeout(() => { 
					clearInterval(timer)
					return resolve(false)
				}, args2);
			})
		}

		// 参数1为函数，参数2为数字的时候才执行
		if (typeof args1 === 'function' && +args2 == args2) {
			// 先执行一下函数（有可能执行报错，考虑加入try catch）
			var bool = args1(document.querySelectorAll);
			// 必须返回Boolean类型
			if (bool === true || bool === false) {
				// 如果直接为true了就返回吧。别浪费时间了
				if (bool === true) return true
				return new Promise(resolve => {
					// 这里改用 setInterval
					var timer = setInterval(() => {
						if (args1(document.querySelectorAll)) {
							clearInterval(timer)
							// 返回dom
							return resolve(true)
						}
					}, 1000);	
					// 几秒之后就取消
					setTimeout(() => { 
						clearInterval(timer)
						return resolve(false)
					}, args2);
				})
			}
		}
		
	} else if (arguments.length >= 3) {
		if (document.querySelectorAll(args1).length > 0) {
			// 返回dom
			return resolve(dom)
		} else {
			console.log('no');
			setTimeout(() => {
				arguments.callee()
			}, __MILLISEC__)
		}
	}


	// return new Promise(resolve => {
	// 	(function () {
	// 		var e = document.querySelectorAll('.app')
	// 		if (e.length > 0) {
	// 			return resolve("long_time_value")
	// 		} else {
	// 			setTimeout(() => {
	// 				arguments.callee()
	// 			}, 1000)
	// 		}
	// 	}());
	// })
}

(async function () {
	// var e = await wait('.app', 10000)
	var e = await wait(function ($) {
		// console.log($);
		// return $('.app').length > 0
	}, 10000);
	console.log(e)
}())

