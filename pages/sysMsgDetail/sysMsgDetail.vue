<template>
	<view class="msgDetail">
		<view class="content">
			<view class="titleBar borderBottom">系统更新内容</view>
			<view class="item borderBottom" v-for="(item,index) in list" :key="index">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addresseeId: '',
				msgId: '',
				list: [
					'1.账单支持删除',
					'2.支持房号绑定业主',
					'3.支持查看业主账单',
					'4.租客房号支持删除',
					'5.支持手动生成最新一期账单',
				]
			}
		},
		onLoad(options) {
			this.list = options.content.split(';')
			this.addresseeId = options.addresseeId
			this.msgId = options.msgId
			this.updateIsRead(this.addresseeId,this.msgId)
		},
		methods: {
			updateIsRead(addresseeId,id){
				this.$request.post('/userMessage/updateIsRead',{
					addresseeId,
					id
				}).then(()=>{})
			},
		}
	}
</script>

<style scoped>
	.msgDetail {
		width: 100%;
		padding: 0 35rpx;
	}

	.content {
		width: 100%;
		color: #333333;
	}

	.borderBottom {
		border-bottom: 1rpx solid #ECECEC;
	}

	.titleBar {
		padding: 38rpx 0;
		font-size: 32rpx;
		font-weight: bold;
	}

	.item {
		padding: 30rpx 0;
		font-size: 30rpx
	}
</style>
