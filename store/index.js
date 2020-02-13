import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		// userOpenId: "1",//用户得openid
		sessionKey: null,
		loginSwitch: '',
		isloginStatus: false, //是否授权登录状态
		userName: "",
		userImg: "",
		openCode: null,
		landladyInfo: {},
		tempRoomInfo: {},
		chooseLocationInfo: {}
	},
	mutations: {
		landladyInfo(state, data) {
			state.landladyInfo = data
		},
		tempRoomInfo(state, data) {
			state.tempRoomInfo = data
		},
		chooseLocationInfo(state, data) {
			state.chooseLocationInfo = data
		},
		userName(state, data) {
			console.log(data)
			state.userName = data
		},
		userImg(state, data) {
			console.log(data)
			state.userImg = data
		},
		openCode(state, data) {
			console.log(data)
			state.openCode = data
		},
		isloginStatus(state, data) {
			console.log(data)
			state.isloginStatus = data
		},
		sessionKey(state, data) {
			state.sessionKey = data
		}
	}
})
export default store
