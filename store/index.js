import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		openCode:"",	//用户登录openCode
		userOpenId: "",	//用户登录openId
		sessionKey: null, //用户登录sessionKey 
		isloginStatus: false, //是否授权登录状态
		landladyInfo: {},	// 登录信息
		tenantId:null,
		chooseLocationInfo: {},
		shareImgPath:""
	},
	mutations: {
		landladyInfo(state, data) {
			state.landladyInfo = data
		},
		chooseLocationInfo(state, data) {
			state.chooseLocationInfo = data
		},
		openCode(state, data) {
			console.log(data)
			state.openCode = data
		},
		userOpenId(state, data) {
			console.log(data)
			state.userOpenId = data
		},
		isloginStatus(state, data) {
			console.log(data)
			state.isloginStatus = data
		},
		sessionKey(state, data) {
			state.sessionKey = data
		},
		tempRenterId(state,data){
			state.tenantId = data
		},
		shareImgPath(state, data){
			state.shareImgPath = data
		}
	}
})
export default store
