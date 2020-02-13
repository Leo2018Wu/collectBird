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
					<span class="bannerText">房源管理</span>
				</view>
				<view @click="goRenterMange">
					<view class="bannerItem"><image class="bannerImg" src="../../static/homeIcon2.png" mode=""></image></view>
					<span class="bannerText">租客管理</span>
				</view>
				<view @click="goBillManage">
					<view class="bannerItem"><image class="bannerImg" src="../../static/homeIcon3.png" mode=""></image></view>
					<span class="bannerText">账单管理</span>
				</view>
				<view @click="goReportForm">
					<view class="bannerItem"><image class="bannerImg" src="../../static/statistical.png" mode=""></image></view>
					<span class="bannerText">统计报表</span>
				</view>
			</view>
		</view>
		<!-- 授权弹窗 -->
		<view class="isloginModal" v-show="loginFlag" @click="cancleLogin"></view>
		<view class="isloginBox" v-show="loginFlag">
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
// import renterInfoBar from '../../components/isLogin/isLgin.vue';
export default {
	// components: {
	// 	isLogin
	// },
	data() {
		return {
			//本月净收入
			mouthIncome: '0',
			billDuein: '0',
			billReceived: '0',
			todayReceived: '0',
			loginFlag: false,
			userName: '',
			userImg: ''
		};
	},
	onShow(option) {
		setTimeout(() => {
			if (this.$store.state.openCode && this.$store.state.isloginStatus) {
				console.log(this.$store.state.openCode);
				this.getLandLadyInfo();
				this.getMoneyInfo();
			} else {
				this.loginFlag = true;
			}
		}, 1000);
	},
	onLoad() {
		// this.getLandLadyInfo();
		// this.getMoneyInfo();
	},
	methods: {
		getMoneyInfo() {
			this.$request
				.post('user/money', {
					id: 'ab8afaed-31f7-11ea-91b8-525400bc2088'
				})
				.then(res => {
					console.log(res);
					let data = res.data.data;
					this.mouthIncome = data.monthIncome;
					this.billReceived = data.monthAllIncome;
					this.billDuein = data.monthUnIncome;
					this.todayReceived = data.todaySumTotal;
				});
		},
		getLandLadyInfo() {
			let _this = this;
			this.$request
				.post('/user/findOne', {
					id: 'ab8afaed-31f7-11ea-91b8-525400bc2088'
				})
				.then(res => {
					_this.$store.commit('landladyInfo', res.data.data);
				})
				.catch(err => {});
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
			this.loginFlag = false;
			console.log(11111);
			let self = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes, '1111');
					self.$store.commit('openCode', loginRes.code);
					// 获取用户信息
					self.$request.post('/wx/login', { code: loginRes.code }).then(res => {
						self.getLandLadyInfo();
						self.getMoneyInfo();
						self.$store.commit('isloginStatus', true);
						console.log(res);
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								if (infoRes.userInfo) {
									console.log(infoRes);
									self.$store.commit('userName', infoRes.userInfo.nickName);
									self.$store.commit('userImg', infoRes.userInfo.avatarUrl);
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
	font-size: 24rpx;
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
	font-size: 26rpx;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
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
}
button::after {
	border: none;
}
</style>
