
<template>
	<view class="message">
		<view class="messageItem">
			<image class="messageIcon" src="../../static/messageIcon1.png" mode="aspectFit"></image>
			<view class="content">
				<view class="top">
					<view>账单提醒</view>
					<span>星期二</span></view>
				<view class="bottom">暂无消息</view>
			</view>
		</view>
		<view class="messageItem">
			<image class="messageIcon" src="../../static/messageIcon2.png" mode="aspectFit"></image>
			<view class="content">
				<view class="top">
					<view>租客提醒</view>
					<span>星期二</span></view>
				<view class="bottom">暂无消息</view>
			</view>
		</view>
		<view class="messageItem">
			<image class="messageIcon" src="../../static/messageIcon3.png" mode="aspectFit"></image>
			<view class="content">
				<view class="top">
					<view>系统消息</view>
					<span>星期二</span></view>
				<view class="bottom">暂无消息</view>
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

<style scoped>
	.messageItem{
		height: 146rpx;
		width: 100%;
		padding:0 26rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		border-bottom: 2rpx solid #F5F5F580;

	}
	.content{
		width: calc(100% - 124rpx);
		height:84rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between
	}
	.messageIcon{
		margin-right: 30rpx;
		width: 84rpx;
		height: 84rpx;
		border-radius: 100%;
	}
	.top{
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.top span{
		color: #999999;
		font-size: 20rpx;
		margin-left: auto;
	}
	.bottom{
		color: #999999;
		font-size: 24rpx;
	}

</style>
