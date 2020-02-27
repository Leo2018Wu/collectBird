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
const getDate = function getDate(value) {
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
	return `${year}-${month}-${day}`;
}

module.exports = {
	chnToNumber,
	dateForm,
	getDate
}
