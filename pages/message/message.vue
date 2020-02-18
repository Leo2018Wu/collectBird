<template>
	<view class="message">
		<view class="messageItem">
			<image class="messageIcon" src="../../static/messageIcon1.png" mode="aspectFit"></image>
			<view class="content">
				<view class="myBox">
					<view class="top">
						<view>账单提醒</view>
						<span>星期二</span>
					</view>
					<view class="bottom">暂无消息</view>
				</view>
			</view>
		</view>
		<view class="messageItem">
			<image class="messageIcon" src="../../static/messageIcon2.png" mode="aspectFit"></image>
			<view class="content">
				<view class="myBox">
					<view class="top">
						<view>租客提醒</view>
						<span>星期二</span>
					</view>
					<view class="bottom">暂无消息</view>
				</view>

			</view>
		</view>
		<view class="messageItem">
			<image class="messageIcon" src="../../static/messageIcon3.png" mode="aspectFit"></image>
			<view class="content">
				<view class="myBox">
					<view class="top">
						<view>系统消息</view>
						<span>星期二</span>
					</view>
					<view class="bottom">暂无消息</view>
				</view>

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
	.message {
		height: 100vh;
		width: 100%;
	}

	.messageItem {
		height: 127rpx;
		width: 100%;
		padding-left: 30rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: 30rpx;
	}

	.content {
		width: calc(100% - 124rpx);
		height: 100%;
		display: flex;
		padding-right: 30rpx;
		border-bottom: 1rpx solid #F5F5F5;
	}
	.myBox{
		margin: auto 0;
		height: 90rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.messageIcon {
		margin-right: 30rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 100%;

	}

	.top {
		font-size: 34rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.top span {
		color: #999999;
		font-size: 22rpx;
		margin-left: auto;
	}

	.bottom {
		color: #999999;
		font-size: 26rpx;
		/* margin-bottom: 20rpx; */
	}

	.line {
		width: 618rpx;
		height: 2rpx;
		/* background-color: red; */
		background: rgba(245, 245, 245, 1);
	}
</style>
