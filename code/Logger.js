var fs = require('fs');
var path = require('path');
var os = require('os');

// 日志路径
Logger.path = 'logs';

// 获取默认的日志文件名
function getDefaultLogFilename(){
	var d = new Date();
	return d.getFullYear() + padLeft(d.getMonth() + 1);
}

// @name 日志名称
// @option 配置项
// {
//		target: 输出，Logger.TO_CONSOLE | Logger.TO_FILE
//		filename: 日志文件名 target 包含Logger.TO_FILE时有效 可以是字符串或函数，默认为 年月
// }
function Logger(name, option) {
	if(typeof option !== 'object') {
		option = {};
	}
	this.__option__ = option;
    this.name = typeof name === 'undefined' ? '_default' : name;
	this.target = option.target || Logger.TO_CONSOLE;
	this.filename = function(){
		if(typeof this.__option__.filename === 'string'){
			return this.__option__.filename;
		} else if(typeof this.__option__.filename === 'function'){
			return this.__option__.filename();
		} else {
			return getDefaultLogFilename();
		}
	}
}

/* 输出设备 */
// 文件
Logger.TO_FILE = 1;
// 控制台
Logger.TO_CONSOLE = 2;

function padLeft(num) {
    if (num < 10) {
        num = '0' + num;
    }

    return num;
}

// 获取当前日志文件的路径
Logger.prototype.getLogPath = function() {
    if (typeof Logger.path === undefined || Logger.path == null || /^\s*$/.test(Logger.path)) {
        Logger.path = '/';
    }

    var p = path.join(process.cwd(), Logger.path);
    if (!fs.existsSync(p)) {
        fs.mkdir(p);
    }

    return p;
};

// 获取当前日志文件的文件名(完整路径)
Logger.prototype.getLogFile = function() {
    var name = path.join(this.getLogPath(), this.filename() + '.log');
    return name;
};

// 获取日期戳
function getTimestamp() {
    var d = new Date();
    return [d.getFullYear(),padLeft(d.getMonth() + 1), padLeft(d.getDate())].join('-') + ' ' + [padLeft(d.getHours()), padLeft(d.getMinutes()), padLeft(d.getSeconds())].join(':');
}

// 记录日志的函数
Logger.prototype.log = function () {
    var args = Array.prototype.slice.call(arguments);
	
    var msg = '[' + getTimestamp() + '] [' + this.name + '] ' + args.shift() + ' ' + args.join('');
	
	if((this.target & Logger.TO_CONSOLE) == Logger.TO_CONSOLE){
		console.log(msg);
	}
	if((this.target & Logger.TO_FILE) == Logger.TO_FILE){
		fs.appendFile(this.getLogFile(), msg + os.EOL);
	}
};

// 添加日志记录函数
['debug', 'info', 'warn', 'error'].forEach(function (item) {
    Logger.prototype[item] = function (message) {
        args = Array.prototype.slice.call(arguments);
        args.unshift(item.toUpperCase() + '\t');
        Logger.prototype.log.apply(this, args);
    }
});

exports.NodeLogger = Logger;