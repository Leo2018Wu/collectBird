<template>
	<view class="islogin">
		<view class="modal" v-show="flag"></view>
		<view class="modalBox" v-show="flag">
			<image src="../static/delete.png" mode=""></image>
			<view class="">
				<image src="../static/notLogin.png" mode=""></image>
				<button class='login' open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="getUserInfo"  plain="true"></button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			closeLogon() {
				this.flag = false;
			},
			// 获取用户授权
			getUserInfo: function (e) {
				this.closeLogon()
				if (e.detail.errMsg == "getUserInfo:fail auth deny") {
					console.log("用户已拒绝授权");
					return;
				}
				app.globalData.userInfo = e.detail.userInfo;
				// 更新后台用户信息
				app.updataUserInfo();
				console.log(app.globalData.userInfo);
				this.$request.post('',{openId: app.userOpenId,isFirst: 1}).then( res=>{
					
				})
				
				wx.request({
					url: app.local + '/user/takeMyStatistics.do',
					header: { 'content-type': 'application/json' },
					data: {
					openId: app.userOpenId,isFirst: 1
					},
					method: "POST",
					success: function (rel) {
						app.globalData.topicNum = rel.data.myMessageNoTopic
						app.globalData.likeNum = rel.data.myMessageNoLike
						app.globalData.commentNum = rel.data.myCommentsNo
				if (rel.data.myCommentsNo > 0 || rel.data.myMessageNoLike > 0 || rel.data.myMessageNoTopic > 0) {
					let text = rel.data.myCommentsNo + rel.data.myMessageNoLike + rel.data.myMessageNoTopic + ""
					wx.setTabBarBadge({
						index: 1,
						text: text
					})
				} else {
					wx.removeTabBarBadge({
						index: 1
					})
				}
			},
			fail: function () { },
			complete: function () { },
		})
		this.triggerEvent('refresh')
	}
		}
		
	}
</script>

<style>
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
	.modalTitle {
		height: 25%;
	}
	.modalContent {
		height: 75%;
	}
	.modalBox {
		width: 513rpx;
		height: 537rpx;
		overflow: hidden;
		position: fixed;
		top: 28%;
		left: 15%;
		z-index: 1001;
		background-image: url(../static/authorization.png);
		background-repeat:no-repeat;
		background-position: 50% 50%;
		background-size: 24rpx 24rpx;
		/* background: rgba(255, 255, 255, 1); */
		/* background: #FAFAFA; */
		/* border-radius: 25rpx; */
	}
	
	.modalTitle {
		padding-top: 40rpx;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		text-align: center;
	}
	
	.modalInput {
		padding: 25rpx 0rpx 10rpx 0rpx;
		/* border-bottom: 1rpx solid #eeeeee; */
		width: 80%;
		text-align: center;
		margin: 0 auto;
		font-size: 30rpx;
	}
	.reminderText {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 160, 68, 1);
	}
	.reminder {
		text-align: center;
		color: #ffa044;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 160, 68, 1);
		display: flex;
		justify-content: center;
		padding: 10rpx 20rpx 25rpx;
	}
	
	.reminderSymbol {
		width: 30rpx;
		height: 30rpx;
		border: 1rpx solid #ffa044;
		border-radius: 50%;
		margin-right: 10rpx;
		line-height: 24rpx;
		text-align: center;
	
	}
	
	.button {
		width: 100%;
		height: 90rpx;
		border-top: 1rpx solid rgba(238, 238, 238, 1);
		display: flex;
		justify-content: space-around;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		position: relative;
		line-height: 80rpx;
	}
	
	.modalLine {
		width: 1rpx;
		height: 89rpx;
		/* border: 1rpx solid rgba(238, 238, 238, 1); */
		background-color: rgba(238, 238, 238, 1);
		position: absolute;
		top: 0%;
		left: 50%;
	}
</style>
