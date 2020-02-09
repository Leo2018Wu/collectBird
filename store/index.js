import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({  
    state: {  
        isLogin: false,  
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
    }  
})
export default store