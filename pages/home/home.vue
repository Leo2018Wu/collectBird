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
	</view>
</template>

<script>
// import renterInfoBar from '../../components/isLogin/isLgin.vue'
export default {
	// components:{
	// 	isLogin
	// },
	data() {
		return {
			//本月净收入
			mouthIncome: '0',
			billDuein: '0',
			billReceived: '0',
			todayReceived: '0'
		};
	},
	onLoad() {
		this.getLandLadyInfo();
		this.getMoneyInfo();
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
		goReportForm(){
			uni.navigateTo({
				url: '../reportForm/reportForm'
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
</style>
