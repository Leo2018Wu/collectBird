<template>
	<view class="message">
		<view class="messageItem" v-for="(item,index) in msgList" :key="index" @click="showMsgList(item.messageType)">
			<image class="messageIcon" :src="item.imgUrl" mode="aspectFit"></image>
			<view class="content">
				<view class="myBox">
					<view class="top">
						<view>{{item.name}}</view>
						<span>{{todayDate}}</span>
					</view>
					<view class="bottom" :class="{posRight:item.unReadNum != 0}">
						<span v-if="!item.unReadNum">暂无消息</span>
						<span class="unReadNum" v-else>{{item.unReadNum}}</span>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				todayDate: '',
				msgList: [{
						imgUrl: '../../static/messageIcon1.png',
						name: '账单提醒',
						unReadNum: 0,
						messageType: 1
					},
					{
						imgUrl: '../../static/messageIcon2.png',
						name: '租客提醒',
						unReadNum: 0,
						messageType: 2
					},
					{
						imgUrl: '../../static/messageIcon3.png',
						name: '系统消息',
						unReadNum: 0,
						messageType: 3
					}
				]
			}
		},
		onShow() {
			this.getMessageTotal(this.$store.state.landladyInfo.id)
		},
		onLoad() {
			var now = new Date();
			var day = now.getDay();
			var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
			this.todayDate = weeks[day];
		},
		methods: {
			getMessageTotal(id) {
				this.$request.post('/userMessage/messageList', {
					addresseeId: id
				}).then((res) => {
					let result = res.data.data
					console.log(result)
					this.msgList.forEach((item, index) => {
						if (index == 0) {
							item.unReadNum = result.billUnreadCount
						} else if (index == 1) {
							item.unReadNum = result.tenantUnreadCount
						} else {
							item.unReadNum = result.systemUnreadCount
						}
					})
				})
			},
			showMsgList(type) {
				uni.navigateTo({
					url: '../systemMessage/systemMessage?messageType='+type
				})
			}
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

	.myBox {
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
		width: 100%;
		color: #999999;
		font-size: 26rpx;
	}

	.posRight {
		display: flex;
		justify-content: flex-end;
	}

	.unReadNum {
		color: #FFFFFF;
		font-size: 24rpx;
		padding: 0 20rpx;
		background-color: #E0483C;
		border-radius: 18rpx;
	}

	.line {
		width: 618rpx;
		height: 2rpx;
		background: rgba(245, 245, 245, 1);
	}
</style>
