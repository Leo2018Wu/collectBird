import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({  
    state: {
		loginSwitch:'',
		isloginStatus: false,
		userName: "",
		userImg: "",
		openCode:"",
        landladyInfo: {},
		tempRoomInfo:{},
		chooseLocationInfo:{}
    },  
    mutations: {  
        landladyInfo(state,data){
			state.landladyInfo = data
		},
		tempRoomInfo(state,data){
			state.tempRoomInfo = data
		},
		chooseLocationInfo(state,data){
			state.chooseLocationInfo = data
		},
		userName(state,data){
			state.userName = data
		},
		userImg(state,data){
			state.userImg = data
		},
		openCode(state,data){
			console.log(data)
			state.openCode = data
		}
    }  
})
export default store