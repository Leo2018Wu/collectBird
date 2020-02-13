<template>
	<view class="">
		<!--  v-if="loginFlag" -->
		<view class="isloginModal" v-if="childLoginFlag" @click="cancleLogin"></view>
		<view class="isloginBox" v-if="childLoginFlag">
			<image class="bgcImg" src="../static/authorization.png" mode=""></image>
			<view class="deleteImg" @click="cancleLogin"><image src="../static/delete.png" mode=""></image></view>
			<view class="loginTxt">授权登录体验完整功能</view>
			<view class="loginImg">
				<view class="notLogin" @click="cancleLogin"><image src="../static/notLogin.png" mode=""></image></view>
				<button class="loginButton" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true"></button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// isloginFlag: false,
			// userName: '',
			// userImg: ''
		};
	},
	props: {
		childLoginFlag: {
			type: Boolean
		},
		childUserName: {
			type: String
		},
		childUserImg: {
			type: String
		}
	},
	methods: {
		cancleLogin() {
			// this.isloginFlag = false;
			this.$emit('childByValue', false); //关键点
			this.$emit('onLoad');
		},
		getUserInfo() {
			let self = this;
			self.$emit('childByValue', false);
			console.log(11111);
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes, '1111');
					self.$store.commit('openCode', loginRes.code);
					let openCode = loginRes.code; //js_code可以给后台获取unionID或openID作为用户标识
					// 获取用户信息
					self.$request.post('/wx/login', { code: openCode }).then(res => {
						if (res) {
							self.$emit('onLoad');
							self.$store.commit('isloginStatus', true);
							self.$store.commit('openCode', res.data.openId);
							self.$store.commit('sessionKey', res.data.sessionKey);
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									if (infoRes.userInfo) {
										self.show = true;
										self.$store.commit('userName', infoRes.userInfo.nickName);
										self.$store.commit('userImg', infoRes.userInfo.avatarUrl);
										self.$emit('onLoad');
										// self.userName = infoRes.userInfo.nickName;
										// self.userImg = infoRes.userInfo.avatarUrl;
										console.log(infoRes);
										//infoRes里面有用户信息需要的话可以取一下
										// let username = infoRes.userInfo.nickName; //用户名
										// let userImg = infoRes.userInfo.userImg; //用户头像
									}
								},
								fail: function(res) {
									uni.showToast({
										title: '微信授权不成功！',
										duration: 2000
									});
								}
							});
						}
					});
				},
				fail: function(res) {}
			});
		}
	}
};
</script>

<style>
/* 登录弹窗 */
.isloginModal {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background: #000;
	opacity: 0.5;
	overflow: hidden;
	z-index: 500;
}
.isloginBox {
	width: 513rpx;
	height: 537rpx;
	overflow: hidden;
	position: fixed;
	top: 19%;
	left: 15%;
	z-index: 1001;
}
.bgcImg {
	width: 100%;
	height: 100%;
	z-index: 9000;
}
.loginTxt {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 36px;
	text-align: center;
	z-index: 9000;
	position: absolute;
	bottom: 79px;
	left: 106rpx;
}
.deleteImg {
	width: 38rpx;
	height: 38rpx;
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	z-index: 9000;
}
.deleteImg image {
	width: 100%;
	height: 100%;
}
.loginImg {
	position: absolute;
	z-index: 9000;
	bottom: 60rpx;
	left: 0rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0rpx 52rpx;
}
.notLogin {
	width: 185rpx;
	height: 70rpx;
}
.notLogin image {
	width: 100%;
	height: 100%;
}
.isLogin image {
	width: 100%;
	height: 100%;
}
.loginButton {
	width: 185rpx !important;
	height: 70rpx !important;
	background-image: url(../static/login.png);
	background-size: 100% 100%;
	margin-left: 37rpx;
	border: none !important;
	outline: none !important;
}
button::after {
	border: none;
}
</style>
