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
const getDate = function getDate(value,two) {
	let date;
	if (value) {
		date = new Date(value);
	} else {
		date = new Date();
	}
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;
	if(two){
		return `${year}-${month}`
	}else{
		return `${year}-${month}-${day}`;
	}
}

var dateDiff = function (timestamp) {
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
  var zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function () {
      var date = new Date(timestamp);
      return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
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

module.exports = {
	chnToNumber,
	dateForm,
	getDate,
	dateDiff
}
