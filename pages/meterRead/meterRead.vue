<template>
	<view class="meterRead">
		<view class="electricity">
			<view class="electricityTxt">电费</view>
			<view class="electricityDetail">
				<view class="left">抄表日期</view>
				<view class="date">{{ date }}</view>
				<view class="right">
					<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
				</view>
			</view>
		</view>
		<view class="text">
			<view class="">上期读数</view>
			<view class="">本期读数</view>
			<view class="">费用</view>
		</view>
		<view class="money">
			<view class="" style="width:33.33%">{{ last }}</view>
			<view class="" style="width:30%">{{ isthis }}</view>
			<view class="" style="width:8%">{{ money }}</view>
		</view>
		<view class="button">完成</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			date: '2020-01-01',
			last: '100',
			isthis: '100',
			money: '100'
		};
	},
	methods: {}
};
</script>

<style>
.meterRead {
	height: 100vh;
	width: 100%;
	background-color: #fafafa;
	position: relative;
}
.electricity {
	height: 177rpx;
	width: 100%;
	padding: 33rpx 60rpx 33rpx 41rpx;
	margin-bottom: 17rpx;
}
.electricityTxt {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
}
.electricityDetail {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	margin-top: 35rpx;
}
.left {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.rightPartImg {
	width: 24rpx;
	height: 24rpx;
}
.right {
	position: absolute;
	top: 1rpx;
	right: -31rpx;
}
.date{
	font-size:30rpx;
	font-family:PingFang SC;
	font-weight:500;
	color:rgba(153,153,153,1);
}
.text,
.money {
	padding: 0rpx 45rpx;
	width: 100%;
	height: 94rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
}
.money {
	padding: 0rpx 48rpx 0rpx 70rpx;
	color: rgba(153, 153, 153, 1);
}
.text {
	color: rgba(51, 51, 51, 1);
	border-bottom: 3rpx solid rgba(235, 235, 235, 1);
}
.button {
	position: absolute;
	bottom: 89rpx;
	left: 246rpx;
	width: 257rpx;
	height: 74rpx;
	background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
	border-radius: 37rpx;
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	text-align: center;
	line-height: 74rpx;
}
</style>
