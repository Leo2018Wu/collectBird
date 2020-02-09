<template>
	<view class="aboutUs">
		<view class="imgContainer">
			<view class="img">
				<image src="../../static/aboutUs.png" mode=""></image>
			</view>
		</view>
		<view class="contactUs" @click="openModal" >
			<view class="left">联系我们</view>
				<view class="right">
					<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
				</view>
		</view>
		<!-- 弹窗 -->
		<view class="modal" v-show="flag" @click="closeModal"></view>
		<view class="modalBox" v-show="flag">
			<view class="modalTitle">通过微信联系我们</view>
			<view class="wechatName">{{wechat}}</view>
			<view class="button" @click="copy">复制微信号</view>
		
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: false,
				wechat:'jayne_zou'
			}
		},
		methods: {
			openModal(e){
				this.flag = true;
			},
			copy(){
				 var that = this;
				    wx.setClipboardData({
				     //准备复制的数据
				      data: that.wechat,
				      success: function (res) {
				        wx.showToast({
				          title: '复制成功',
				        });
				      }
				    });
			},
			closeModal(){
				this.flag = false;
			}
		}
	}
</script>

<style>
	.aboutUs{
		width: 100%;
		height: 100vh;
	}
	.imgContainer{
		width: 100%;
		height: 40%;
		display: flex;
		justify-content:center;
		align-items:Center;
	}
	.img{
		width: 180rpx;
		height: 180rpx;
	}
	.img image{
		width: 100%;
		height: 100%;
	}
	.contactUs{
		width: 100%;
		height: 80rpx;
		padding:52rpx 37rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 2rpx solid rgba(246,246,246,1);
		border-bottom: 2rpx solid rgba(246,246,246,1);
	}
	.rightPartImg {
		width: 24rpx;
		height: 24rpx;
	} 
	.left{
		font-size:28rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(102,102,102,1);
		line-height:36rpx;
	}
	/* 弹窗 */
	.modal {
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
	.modalBox {
		width:672rpx;
		height:334rpx;
		border-radius:20rpx;
		overflow: hidden;
		position: fixed;
		top: 31%;
		left: 6%;
		z-index: 1001;
		background: rgba(255, 255, 255, 1);	
		text-align: center;
	}
	
	.modalTitle {
		height: 30%;
		padding-top: 40rpx;
		font-size:36rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:36px;
	}
	
	.button {
		width: 100%;
		height: 36%;
		border-top: 2rpx solid rgba(238, 238, 238, 1);
		display: flex;
		justify-content: space-around;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color:#FFA044;
		position: relative;
		line-height: 90rpx;
	}
	
	.wechatName{
		height: 30%;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(107,107,107,1);
		line-height: 36px;
		margin-top: 30rpx;
	}
	.active {
		color: #ffa044;
	}
</style>
