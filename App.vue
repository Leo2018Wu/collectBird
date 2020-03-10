<script>
export default {
	onLaunch: function() {
	let _this = this;
	// uni.getSetting({
	// 	success(res) {
	// 		console.log(res)
	// 		if (res.authSetting['scope.userInfo']) {
	// 			_this.$store.commit('isloginStatus',true)
	// 		}
	// 	}
	// })
	},
	
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	// 用户的头像昵称
	globalData: {
		userName: '',
		userImg: '',
		networkType: 'net' ,//当前网络状态
	},
	userOpenId: '1', //用户得openid
	// 当用户执行授权时更新后台用户信息
	updataUserInfo: function() {
		let _this = this;
		let data = {
			openId: _this.userOpenId,
			userName: _this.globalData.userInfo.nickName,
			userImg: _this.globalData.userInfo.avatarUrl
		};
		console.log(data);
		wx.request({
			url: _this.local + '/user/update.do',
			header: { 'content-type': 'application/json' },
			data: data,
			method: 'POST',
			success(res) {
				console.log(res);
			},
			fail(error) {
				console.log(error);
			}
		});
	}
	// // 获取网络状态
	// getNet() {
	//   let _this = this
	//   wx.getNetworkType({
	//     success: function (res) {
	//       if (_this.globalData.networkType != res.networkType) {
	//         wx.showLoading({
	//           title: '正在重新登录',
	//           mask: true
	//         }),
	//         _this.reLoad(res.networkType);
	//       }
	//     },
	//   });
	//  }
};
</script>

<style>
/*每个页面公共css */
view,
input,
scroll-view {
	box-sizing: border-box;
}
.textOverFlow {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
switch {
	transform: scale(0.6);
}
radio {
	transform: scale(0.7);
}
.form-input-placeholder {
	color: #999999;
	font-size: 30rpx;
	text-align: right !important;
}
.form-input {
	width: 100%;
	height: 100%;
	text-align: right;
	font-size: 32rpx;
	color: #999999;
}
button {
	margin: 0;
	padding: 0;
	border: none !important;
}
button::after {
	border: none;
}
button { background-color: #fff; }
.btnHoverClass {
	background-color: #FFFFFF !important;
}
</style>
