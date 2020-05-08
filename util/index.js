// 中文转化成数字
const chnToNumber = function chnToNumber(chnStr) {
	var chnNumChar = {
		零: 0,
		一: 1,
		两: 2,
		二: 2,
		三: 3,
		四: 4,
		五: 5,
		六: 6,
		七: 7,
		八: 8,
		九: 9,
		"0": 0,
		"1": 1,
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,

	}
	var number = 0;
	let resArr = [];
	var str = chnStr.split('');
	for (let i = 0; i < str.length; i++) {
		var num = chnNumChar[str[i]];
		if (typeof num !== 'undefined') {
			resArr.push(num);
		}
	}
	return resArr;
}
const dateForm = function dateForm(value) {
	let data = value.split(' ')[0];
	return data;
}
const getDate = function getDate(value, two) {
	let date;
	if (value) {
		date = new Date(value);
	} else {
		date = new Date();
	}
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	if (!two) {
		month = month > 9 ? month : '0' + month;
		day = day > 9 ? day : '0' + day;
	}
	if (two) {
		return `${year}-${month}`
	} else {
		return `${year}-${month}-${day}`;
	}
}

var dateDiff = function(timestamp) {
	console.log(timestamp)
	// 补全为13位
	var arrTimestamp = (timestamp + '').split('');
	for (var start = 0; start < 13; start++) {
		if (!arrTimestamp[start]) {
			arrTimestamp[start] = '0';
		}
	}
	timestamp = arrTimestamp.join('') * 1;

	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - timestamp;

	// 如果本地时间反而小于变量时间
	if (diffValue < 0) {
		return '不久前';
	}

	// 计算差异时间的量级
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;

	// 数值补0方法
	var zero = function(value) {
		if (value < 10) {
			return '0' + value;
		}
		return value;
	};

	// 使用
	if (monthC >= 1) {
		// 超过1年，直接显示年月日
		return (function() {
			var date = new Date(timestamp);
			return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
		})();
	} else if (weekC >= 1) {
		return parseInt(weekC) + "周前";
	} else if (dayC >= 1) {
		return parseInt(dayC) + "天前";
	} else if (hourC >= 1) {
		return parseInt(hourC) + "小时前";
	} else if (minC >= 1) {
		return parseInt(minC) + "分钟前";
	}
	return '刚刚';
};
/**
 * 金额输入限制
 */
const moneyLimit = function(param) {
	let num = param.toString(); //先转换成字符串类型
	if (num.indexOf('.') == 0) { //第一位就是 .
		num = '0' + num
	}
	num = num.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
	num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
	num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
	if (num.indexOf(".") < 0 && num != "") {
		num = parseFloat(num);
	}
	return num
}
// 过滤emoji和空格和特殊字符
const filterEmoji = function(name) {
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]");
	var rs = "";
	for (var i = 0; i < name.length; i++) {
		rs = rs + name.substr(i, 1).replace(pattern, '');
	}
	var str = rs.replace(
		/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig,
		"");
	return str.replace(/\s+/g, '');

}
const thousandsPoints = function (value, unit) { //  '--'  ''  null  '333'
  if (!value || typeof(value)=="undefined") {
    return '--'
  }
  if (isNaN(parseFloat(value))) return value
  var str = value.toString()
  if (str.indexOf('.') > -1) {
    str = str.split('.')
    str[0] = str[0].replace(/(?=(?!^)(\d{3})+$)/g, ',')
    return unit ? str.join('.') + unit : str.join('.')
  }
  return unit ? value.toString().replace(/(?=(?!^)(\d{3})+$)/g, ',') + unit : value.toString().replace(/(?=(?!^)(\d{3})+$)/g, ',')
}
module.exports = {
	chnToNumber,
	dateForm,
	getDate,
	dateDiff,
	moneyLimit,
	filterEmoji,
	thousandsPoints
}
