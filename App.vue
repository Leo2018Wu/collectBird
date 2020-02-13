<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		// 获取用户openId 
		// uni.login({
		// 	//获取code
		// 	success: function(res) {
		// 		console.log('得到conde：');
		// 		console.log(res);
		// 		let data = {
		// 			code: res.code
		// 		};
		// 		console.log('请求openID提交的数据：');
		// 		console.log(data);
		// 		// 获取服务器端的openid
		// 		// this.$request.post('/wx/login',data).then( res=>{
		// 		// 		console.log(res)
		// 		// 		this.sessionKey = res.data.sessionKey;
		// 		// 		this.userOpenId = res.data.openId;
		// 		// 	})
		// 		uni.request({
		// 			url: 'https://funnyduck.raysler.com/rentbird/wx/login',
		// 			data: data,
		// 			header: { 'content-type': 'application/json' },
		// 			method: 'POST',
		// 			success: function(res) {
		// 				console.log('获取服务器端openId成功：');
		// 				console.log(res);
		// 				if (res.data.openId) {
		// 					this.userOpenId = res.data.openId;
		// 					// this.getusernews();
		// 				} else {
		// 					wx.showToast({
		// 						title: '登录异常，请关闭小程序重新登录',
		// 						icon: 'none',
		// 						duration: 900000
		// 					});
		// 					return;
		// 				}
		// 				// _this.userOpenId = "123460admin";
		// 				this.sessionKey = res.data.sessionKey;
		// 				// 或许openId为异步。用callback保证得到OpenId后能再执行首页的获取数据操作
		// 				// if (_this.userOpenIdCallback) {
		// 				// 	_this.userOpenIdCallback();
		// 				// }

		// 				// if (_this.globalData.userInfo != null) {
		// 				// 	_this.updataUserInfo();
		// 				// }
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
	}
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
}
button {
	margin: 0;
	padding: 0;
	border: none !important;
}
</style>
