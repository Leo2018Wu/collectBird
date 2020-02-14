<script>
export default {
	onLaunch: function() {
		// // 获取用户openId;
		// uni.login({
		// 	//获取code
		// 	success: function(res) {
		// 		console.log('得到conde:', res.code, res);
		// 		let data = {
		// 			code: res.code
		// 		};
		// 		console.log('请求openID提交的数据：', data);
		// 		uni.request({
		// 			url: 'https://funnyduck.raysler.com/rentbird/wx/login',
		// 			data: data,
		// 			header: { 'content-type': 'application/json' },
		// 			method: 'POST',
		// 			success: function(res) {
		// 				console.log('获取服务器端openId成功：', res.data.openId);
		// 				console.log('获取服务器端sessionKey成功：', res.data.sessionKey);
		// 				console.log(res);
		// 				if (res.data.openId) {
		// 					_this.userOpenId = res.data.openId;
		// 				} else {
		// 					wx.showToast({
		// 						title: '登录异常，请关闭小程序重新登录',
		// 						icon: 'none',
		// 						duration: 900000
		// 					});
		// 					return;
		// 				}
		// 				_this.sessionKey = res.data.sessionKey;
		// 				// 或许openId为异步。用callback保证得到OpenId后能再执行首页的获取数据操作
		// 				// if (_this.userOpenIdCallback) {
		// 				// 	_this.userOpenIdCallback();
		// 				// }

		// 				if (_this.globalData.userName != null) {
		// 					_this.updataUserInfo();
		// 				}
		// 				// if (_this.getUserInfoFun) {
		// 				// 	_this.getUnionId();
		// 				// }
		// 			},
		// 			fail: function(error) {
		// 				let data11 = new Date();
		// 				console.log('获取服务器端oopenId失败：' + data11);
		// 				console.log(error);
		// 			}
		// 		});
		// 	}
		// });
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
		networkType: 'net' //当前网络状态
		// topicNum:'',
		// likeNum:'',
		// commentNum:''
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
</style>
