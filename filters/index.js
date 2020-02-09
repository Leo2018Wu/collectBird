import moment from 'moment'
const addSpace = function addSpace(value) {
	return value ? value + '  ' : value
}
const dateForm = function dateForm(value) {
	// var datatime = value.replace(/\-/g, "/")
	let date = new Date(value)
	console.log(date)
	let year = date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear()
	let month = Number(date.getMonth() + 1) < 10 ? '0' + Number(date.getMonth() + 1) : Number(date.getMonth() + 1)
	let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

	let res = year + '-' + month + '-' + day
	console.log(res)
	return res
	console.log(moment().weekYear(value))
}
module.exports = {
	addSpace,
	dateForm
}