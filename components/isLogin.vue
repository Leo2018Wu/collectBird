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
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {};
	},
	props: {
		childLoginFlag: {
			type: Boolean
		}
	},
	methods: {
		cancleLogin() {
			this.$emit('childByValue', false); //关键点
		},
		getUserInfo() {
			this.loginFlag = false;
			console.log(11111);
			let self = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes, '1111');
					uni.checkSession({
						success() {
							// session_key 未过期，并且在本生命周期一直有效
							self.$store.commit('openCode', loginRes.code);
							self.$request.post('/wx/login', { code: loginRes.code }).then(res => {
								console.log(res);
								if (res) {
									self.openId = res.data.data.openid;
									self.$store.commit('isloginStatus', true);
									self.$store.commit('userOpenId', res.data.data.openid);
									self.$store.commit('sessionKey', res.data.data.session_key);
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											console.log(infoRes);
											if (infoRes.userInfo) {
												self.show = true;
												// 微信的gender 1 男 2 女 0 未知
												// 收租鸟userSex 0 男 1 女
												if (infoRes.userInfo.gender == '1') {
													self.gender = '0';
												} else if (infoRes.userInfo.gender == '2') {
													self.gender = '1';
												} else {
													self.gender = '未知';
												}
												let userInfo = {
													openId: res.data.data.openid,
													userName: infoRes.userInfo.nickName,
													userImg: infoRes.userInfo.avatarUrl,
													userSex: self.gender
												};
												self.getMineMsg(userInfo);
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
						fail() {
							// session_key 已经失效，需要重新执行登录流程
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									self.$request.post('/wx/login', { code: loginRes.code }).then(res => {
										console.log(res);
									});
								}
							}); // 重新登录
						}
					});
				},
				fail: function(res) {}
			});
		},
		getMineMsg(userInfo) {
			let _this = this;
			_this.$request
				.post('user/findByOpenId', userInfo)
				.then(res => {
					_this.$store.commit('landladyInfo', res.data.data);
					console.log(res.data.data);
					let myMsgs = res.data.data;
					this.$emit('childByValue', res.data.data);
					this.$emit('ffffff', false);
				})
				.catch(err => {
					console.log(err);
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
