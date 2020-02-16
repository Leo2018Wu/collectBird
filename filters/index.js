import moment from 'moment'
const addSpace = function addSpace(value) {
	return value ? value + '  ' : value
}
const dateForm = function dateForm(value) {
	let data = value.split(' ')[0];
	console.log(data)
	return data;
}
module.exports = {
	addSpace,
	dateForm
}