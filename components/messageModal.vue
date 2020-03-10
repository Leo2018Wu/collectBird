<template>
	<view>
		<cover-view class="modalMask" @click="cancel()" @catchtouchmove='true'>
			<cover-image class="messageIcon" src="../static/messageIcon.png" mode="aspectFit"></cover-image>
			<cover-view class="modelContainer">
				<cover-view class="modalTitle">到期提醒</cover-view>
				<cover-view v-if="deadNum == ''">您的权限已到期</cover-view>
				<cover-view class="deadline" v-else><cover-view>您的权限还有</cover-view><cover-view class="deadNum">{{deadNum}}</cover-view><cover-view>天到期</cover-view></cover-view>
				<cover-view class="modalContent">请及时续费以免影响收租</cover-view>
				<cover-view class="btnSure" @click="sure()">立即续费</cover-view>
				<cover-view class="btnCacncel">再等等</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	export default {
		props:{
			deadNum:''
		},
		data() {
			return {
				
			};
		},
		methods:{
			cancel(){
				this.$emit('emitCancel')
			},
			sure(){
				this.$emit('emitSure')
			}
		}
	}
</script>

<style scoped>
	.modalMask{
		width: 100%;
		height: 100vh;
		background:rgba(0,0,0,0.3);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.modelContainer{
		border-radius: 25rpx;
		background-color: #FFFFFF;
		padding: 40rpx 70rpx 36rpx 70rpx;
		font-size: 30rpx;
		color: #333333;
		position: absolute;
		left: 125rpx;
		top:300rpx;
		text-align: center;
		
	}
	.modalTitle{
		margin-bottom: 40rpx;
		font-size: 34rpx;
		font-weight: bold;
	}
	.modalContent{
		margin: 10rpx 0 60rpx 0 ;
	}
	.btnSure{
		width:358rpx;
		height:74rpx;
		text-align: center;
		line-height: 74rpx;
		margin: 0 auto;
		background:rgba(243,183,73,1);
		border-radius:37rpx;
		font-size: #F7F7F7;
		font-size: 34rpx;
		color: #FFFFFF;
	}
	.btnCacncel{
		width: 100%;
		padding-top: 24rpx;
		color: #BDBDBD;
		font-size: 26rpx;
	}
	.messageIcon{
		width: 100rpx;
		height: 110rpx;
		position: absolute;
		top: 240rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
	}
	.deadline cover-view{
		display: inline-block;
	}
	.deadNum{
		color: #ffc444;
		font-size: 36rpx;
	}
</style>
