// const addSpace = function addSpace(value) {
// 	return value ? value + '  ' : value
// }

// module.exports = {
// 	addSpace,
// }

export function addSpace(value) {
	return value ? value + '  ' : value
}
/**
 * 千位分隔符
 */
export function thousandsPoints(value, unit) { //  '--'  ''  null  '333'
  if (!value) {
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
/**
 * 为空,null,undefined返回0
 */
export function returnZero(value){
	console.log(value)
	return value ? value : 0;
}