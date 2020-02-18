<template>
	<view class="home">
		<view class="mouth">
			<view class="mouthIncome">
				<view class="mouthIncomeText">本月净收入 (元)</view>
				<span class="mouthIncomeNum">{{ mouthIncome }}</span>
			</view>
			<view class="payment">
				<view class="">
					<view class="paymentText">本月账单待收</view>
					<span class="paymentNum">{{ billDuein }}</span>
				</view>
				<view class="">
					<view class="paymentText">本月账单已收</view>
					<span class="paymentNum">{{ billReceived }}</span>
				</view>
				<view class="">
					<view class="paymentText">今日已收金额</view>
					<span class="paymentNum">{{ todayReceived }}</span>
				</view>
			</view>
		</view>
		<view class="bannerBox">
			<view class="bannerTop">
				<view @click="toHouseList">
					<view class="bannerItem"><image class="bannerImg" src="../../static/homeIcon1.png" mode=""></image></view>
					<span class="bannerText">房源</span>
				</view>
				<view @click="goRenterMange">
					<view class="bannerItem"><image class="bannerImg" src="../../static/homeIcon2.png" mode=""></image></view>
					<span class="bannerText">租客</span>
				</view>
				<view @click="goBillManage">
					<view class="bannerItem"><image class="bannerImg" src="../../static/homeIcon3.png" mode=""></image></view>
					<span class="bannerText">账单</span>
				</view>
				<view @click="goReportForm">
					<view class="bannerItem"><image class="bannerImg" src="../../static/statistical.png" mode=""></image></view>
					<span class="bannerText">统计</span>
				</view>
			</view>
			<view class="banner">
				<swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
					<block v-for="(item, index) in imgUrls" :key="index">
						<swiper-item><image :src="item" class="slide-image" mode="aspectFill" /></swiper-item>
					</block>
				</swiper>
			</view>
		</view>

		<!-- 授权弹窗 -->
		<view class="isloginModal" v-if="loginFlag" @click="cancleLogin"></view>
		<view class="isloginBox" v-if="loginFlag">
			<image class="bgcImg" src="../../static/authorization.png" mode=""></image>
			<view class="deleteImg" @click="cancleLogin"><image src="../../static/delete.png" mode=""></image></view>
			<view class="loginTxt">授权登录体验完整功能</view>
			<view class="loginImg">
				<view class="notLogin" @click="cancleLogin"><image src="../../static/notLogin.png" mode=""></image></view>
				<button class="loginButton" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true"></button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mouthIncome: '0', //本月净收入
			billDuein: '0', //本月账单待收
			billReceived: '0', //本月账单已收
			todayReceived: '0', //今日已收金额
			loginFlag: false,
			isPopUpModal: false,
			swiperCurrent: 0,
			circular: true,
			background: ['color1', 'color2', 'color3'],
			imgUrls: ['../../static/banner1.jpg', '../../static/banner2.jpg'],
			indicatorDots: true,
			autoplay: true,
			interval: 3000,
			duration: 500
		};
	},
	onLoad() {
		this.checkLoginStatus().then(res => {
			this.loginFlag = res;
		});
		console.log(this.$store.state.isloginStatus);
	},
	onShow(option) {
		if (this.isPopUpModal) {
			this.checkLoginStatus().then(res => {
				this.loginFlag = res;
			});
			console.log(this.$store.state.isloginStatus);
		}
		this.getMoneyInfo();
	},
	methods: {
		checkLoginStatus() {
			let _this = this;
			return new Promise((reslove, rej) => {
				//判断用户是否授权过
				uni.getSetting({
					success(res) {
						console.log(res);
						if (res.authSetting['scope.userInfo']) {
							_this.$store.commit('isloginStatus', true);
							_this.getUserInfo();
						}
					},
					complete() {
						reslove(!_this.$store.state.isloginStatus);
					}
				});
			});
		},
		getLandLadyInfo(userInfo) {
			let _this = this;
			_this.$request
				.post('user/findByOpenId', userInfo)
				.then(res => {
					console.log(res);
					_this.$store.commit('landladyInfo', res.data.data);
					_this.getMoneyInfo();
				})
				.catch(err => {});
		},
		getMoneyInfo() {
			let _this = this;
			_this.$request
				.post('user/money', {
					id: _this.$store.state.landladyInfo.id
				})
				.then(res => {
					console.log(res);
					let data = res.data.data;
					_this.mouthIncome = data.monthIncome;
					_this.billReceived = data.monthAllIncome;
					_this.billDuein = data.monthUnIncome;
					_this.todayReceived = data.todaySumTotal;
				});
		},
		toHouseList(e) {
			uni.navigateTo({
				url: '../houseList/houseList'
			});
		},
		goRenterMange() {
			uni.navigateTo({
				url: '../renterManage/renterManage'
			});
		},
		goBillManage() {
			uni.navigateTo({
				url: '../billManage/billManage'
			});
		},
		goReportForm() {
			uni.navigateTo({
				url: '../reportForm/reportForm'
			});
		},
		getUserInfo() {
			let self = this;
			self.loginFlag = false;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes, '1111');
					self.$store.commit('openCode', loginRes.code);
					// 获取用户信息
					self.$request.post('/wx/login', { code: loginRes.code }).then(res => {
						self.$store.commit('isloginStatus', true);
						self.$store.commit('userOpenId', res.data.data.openid);
						self.$store.commit('sessionKey', res.data.data.session_key);
						console.log(res);
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								if (infoRes.userInfo) {
									console.log(infoRes);
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
									self.getLandLadyInfo(userInfo);
								}
							},
							fail: function(res) {
								uni.showToast({
									title: '微信授权不成功！',
									duration: 2000
								});
							}
						});
					});
				},
				fail: function(res) {}
			});
		},
		cancleLogin(e) {
			this.loginFlag = false;
		},
		//轮播图的切换事件
		swiperChange(e) {
			this.setData({
				swiperCurrent: e.detail.current
			});
		},
		//点击指示点切换
		chuangEvent(e) {
			this.setData({
				swiperCurrent: e.currentTarget.id
			});
		},
		//点击图片触发事件
		swipclick(e) {
			console.log(this.data.swiperCurrent);
			wx.switchTab({
				url: this.data.links[this.data.swiperCurrent]
			});
		}
	}
};
</script>

<style>
.home {
	width: 100%;
	height: 100vh;
	position: relative;
}

.mouth {
	height: 32%;
	background-color: #f09a42;
}

.mouthIncome {
	width: 100%;
	height: 48%;
	background-color: #f09a42;
	color: #ffffff;
	padding: 30rpx 56rpx;
	text-align: center;
}

.mouthIncomeNum {
	margin-top: 20rpx;
	text-align: center;
	font-size: 82rpx;
	font-family: PingFang-SC-Heavy;
	font-weight: 800;
}

.mouthIncomeText {
	font-size: 32rpx;
	text-align: center;
	font-family: PingFang-SC-Regular;
}

.payment {
	height: 60%;
	display: flex;
	justify-content: space-between;
	text-align: center;
	padding: 0 20rpx;
	color: #ffffff;
	font-size: 36rpx;
	padding: 60rpx 60rpx;
}

.paymentText {
	margin-bottom: 10rpx;
	font-size: 26rpx;
}

.bannerBox {
	width: 100%;
	background-color: #fff;
	border-radius: 25rpx;
	position: absolute;
	top: 30%;
	left: 0rpx;
}
.bannerTop {
	height: 30%;
	display: flex;
	justify-content: space-between;
	text-align: center;
	padding: 60rpx 60rpx;
}

.bannerImg {
	max-width: 88rpx;
	max-height: 88rpx;
}
.bannerText {
	color: #333333;
	font-size: 28rpx;
	font-family: PingFang-SC-Medium;
	font-weight: 600;
}

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
	background-image: url(../../static/login.png);
	background-size: 100% 100%;
	margin-left: 37rpx;
	border: none !important;
	outline: none !important;
	border-radius: 30rpx;
}
button::after {
	border: none;
}

/* 轮播图 */
.swiper {
	width: 643rpx;
	height: 191rpx;
	padding:0rpx 54rpx;
}
.slide-image {
	width: 100%;
	height: 100%;
}
.banner {
	position: absolute;
	top: 260rpx;
	left: 0rpx;
	width: 100%;
}
</style>
