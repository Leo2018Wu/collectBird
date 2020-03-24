<template>
	<view class="tipModal">
		<cover-view class="modalMask" @click="cancel()" @catchtouchmove='true'>
			<cover-view class="modelContainer">
				<cover-view class="modalTitle">{{title}}</cover-view>
				<cover-view class="modalContent">{{describition}}</cover-view>
				<cover-view class="btnBox" v-if="!oneButton">
					<cover-view class="btnDivide"></cover-view>
					<cover-view class="modalSure" @click="sure()">删除</cover-view>
					<cover-view class="modalCancel" @click="cancel()">取消</cover-view>
				</cover-view>
				<cover-view class="btnBox1" v-else>
					<cover-view class="modalSure1" @click="cancel()">知道了</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
		
	</view>
</template>

<script>
	export default {
		props:{
			title:{
				type:String,
				default:'删除房源'
			},
			describition:{
				type:String,
				default:'将会删除一切数据，包含账单，是否删除？'
			},
			oneButton:{
				type:Boolean,
				default:false
			}
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
	.modelContainer{
		width: 540rpx;
		/* height: fit-content; */
		background-color: #FFFFFF;
		border-radius: 25rpx;
		margin: 280rpx 0 0 105rpx;
		padding-top: 40rpx;
		text-align: center;
	}
	.modalTitle{
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
	.modalContent{
		font-size: 30rpx;
		width: 400rpx;
		height: fit-content;
		margin: 0 auto 30rpx auto;
		white-space: normal;
		line-height: 36rpx;
	}
	.btnBox1{
		width: 100%;
		height: 120rpx;
	}
	.modalSure1{
		width:220rpx;
		height:74rpx;
		margin: 23rpx auto 0 auto;
		line-height: 74rpx;
		background:#FFA044;
		box-shadow:0px 8px 19px 2px rgba(242,166,69,0.4);
		border-radius:37px;
		color: #FFFFFF;
		font-size: 34rpx;
	}
	.btnBox{
		border-top: 2rpx solid rgba(217,217,220,0.6);
		width: 100%;
		height: 90rpx;
		position: relative;
	}
	.btnBox .modalCancel,.btnBox .modalSure{
		width: 50%;
		height: 100%;
		font-size: 34rpx;
		font-weight: 500;
		display: inline-block;
		line-height: 90rpx;
	}
	.btnBox .modalCancel{
		color: #FFA044;
	}
	.btnBox .modalSure{
		color: #BABABA;
	}
	.btnDivide{
		width: 2rpx;
		height: 100%;
		background-color: rgba(217,217,220,0.6);
		position: absolute;
		right: 50%;
		top: 0;
	}
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
</style>
