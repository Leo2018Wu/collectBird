<template>
	<view class="meterRead">
		<view class="electricity">
			<view class="electricityTxt">
				电费
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.meterRead{
		height: 100vh;
		width: 100%;
		background-color: #FAFAFA;
	}
	.electricity{
		height: 177rpx;
		width: 100%;
		padding: 33rpx 41rpx;
	}
	.electricityTxt{
		font-size:30rpx;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}
</style>
