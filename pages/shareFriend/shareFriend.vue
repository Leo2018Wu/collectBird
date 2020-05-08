<template>
	<view class="shareFriend">
		<canvas canvas-id="myCanvas"></canvas>
		<image class="bannerImg" src="../../static/shareBanner.jpg" mode="aspectFit"></image>
		<view class="content">
			<view class="titleBar">活动规则</view>
			<view class="actDate">活动时间</view>
			<view class="detail">即日起至：2020年10月1日</view>
			<view class="actDate">活动说明</view>
			<view class="detail">每位用户都有自己独有的邀请码，邀请用户入驻并填写你的邀请码，新用户付费之后，您将获得最高30%的现金返佣，或者价值50%金额的有效期延长。</view>
			<view class="btnBox">
				<!-- <view class="setImg" @click="saveImg">生成分享图</view> -->
				<view class="setImg" @click="saveImg1">生成分享图</view>
				<button class="shareBtn" open-type="share" hover-class="btnHoverClass">分享好友</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,

	} from 'vuex';
	export default {
		data() {
			return {
				postersData: {},
				tempPath: '',
				ctx: {},
				bgUrl: "https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/shareFriend.jpg",
			};
		},
		computed: {
			...mapState(['landladyInfo'])
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.landladyInfo.userName + '邀请您体验收租神器',
				imageUrl: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/share1.jpg',
				// imageUrl: '/static/share1.jpg',
				path: '/pages/home/home'
			}
		},
		onLoad() {
			this.ctx = uni.createCanvasContext('myCanvas')
			if (this.$store.state.shareImgPath) {
				this.tempPath = this.$store.state.shareImgPath
			}

		},
		methods: {
			saveImg1() {
				let _this = this;
				uni.showLoading({
					title:"海报正在绘制..."
				})
				_this.ctx = uni.createCanvasContext('myCanvas')
				_this.getImageInfo(_this.bgUrl).then(imgInfo => {
					console.log(imgInfo.localPath)
					_this.ctx.drawImage(imgInfo.localPath, 0, 0, 375, 637)
					_this.ctx.save(); // 保存
					_this.ctx.setFontSize(18)
					_this.ctx.setTextAlign('center')
					// _this.drawWrapText(_this.ctx, "璐璐邀请您体验收租鸟", 18, 322, 375)
					_this.ctx.fillText(_this.landladyInfo.userName+'邀请您体验收租鸟', 375 / 2, 322)
					_this.ctx.fillText(_this.landladyInfo.userName+'邀请您体验收租鸟', 375 / 2 - 0.3, 322)
					var x = 151,
						y = 211,
						size = 73;
					_this.ctx.restore();
					_this.ctx.save(); // 保存
					_this.ctx.arc((size / 2 + x), (size / 2 + y), (size / 2) + 2, 0, Math.PI * 2, false);
					_this.ctx.setFillStyle('#FFFFFF');
					_this.ctx.fill()
					_this.ctx.restore();
					_this.ctx.beginPath(); // 开始绘制
					_this.ctx.arc(size / 2 + x, size / 2 + y, size / 2, 0, Math.PI * 2, false);
					_this.ctx.clip();
					_this.getImageInfo(_this.landladyInfo.userImg).then(res => {
						_this.ctx.restore();
						_this.ctx.drawImage(res.localPath, x, y, size, size);
						_this.ctx.draw(true,()=>{
							_this.saveImageToLocal()
						});
					})
				})
			},
			saveImageToLocal(){
				uni.canvasToTempFilePath({
				    x: 0,
				    y: 0,
				    width:375,
				    height:637,
				    canvasId: 'myCanvas',
				    success: res => {
				        if (res.errMsg === 'canvasToTempFilePath:ok') {
							this.tempPath = res.tempFilePath
				            this.saveImgMobile()
				        }
				    }
				}, this);
			},
			getImageInfo(url) {
				return new Promise((resolve, reject) => {
					/* 获得要在画布上绘制的图片 */
					const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
					if (objExp.test(url)) {
						uni.getImageInfo({
							src: url,
							complete: res => {
								if (res.errMsg === 'getImageInfo:ok') {
									const img = {
										localPath: res.path
									};
									resolve(img);
								} else {
									reject(new Error('getImageInfo fail'));
								}
							}
						});
					}
				})

			},
			saveImgMobile() {
				let _this = this;
				// if (!this.tempPath) {
				// 	uni.showToast({
				// 		title: '海报正在绘制，请稍后重试',
				// 		icon: 'none',
				// 		duration: 2000,
				// 	})
				// 	return;
				// }
				uni.saveImageToPhotosAlbum({
					filePath: _this.tempPath,
					success: function() {
						console.log('save success');
						uni.showToast({
							title: '分享图已保存，快去分享吧！',
							icon: 'none',
							duration: 2000
						})
					},
					fail(err) {
						if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
							console.log("打开设置窗口");
							uni.showModal({
								title: '获取权限',
								content: '获取您拒绝过的相册权限',
								success: function(res) {
									if (res.confirm) {
										uni.openSetting({
											success(settingdata) {
												console.log(settingdata)
												if (settingdata.authSetting["scope.writePhotosAlbum"]) {
													console.log("获取权限成功，再次点击图片保存到相册")
												} else {
													console.log("获取权限失败")
												}
											},
											fail(errMsg) {
												console.log(errMsg)
											}
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});

						}
					},
					complete() {
						uni.hideLoading()
					}
				});
			},
			saveImg() {
				if (!this.tempPath) {
					uni.showLoading({
						title: '海报正在绘制...'
					})
					this.initPostersConfig(this.landladyInfo.userImg);
				} else {
					this.saveImgMobile()
				}
			},
			initPostersConfig(avaUrl) {
				const config = {
					clear: true,
					width: 375,
					height: 637,
					background: '#ffffff',
					views: [{
							type: 'image',
							width: 375,
							height: 637,
							top: 0,
							left: 0,
							// 封面图，测试的时候填上
							url: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/shareFriend.jpg'
						},
						{
							type: 'rect',
							width: 77,
							height: 77,
							left: 149,
							top: 210,
							background: '#FFFFFF',
							radius: 38.5
						},
						{
							type: 'image',
							width: 73,
							height: 73,
							top: 212,
							left: 151,
							radius: 36.5,
							// 封面图，测试的时候填上
							// url: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/share1.jpg'
							url: avaUrl ? avaUrl : 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/share1.jpg'
						},
						{
							type: 'text',
							width: 305,
							height: 20,
							left: 375 / 2,
							top: 305,
							textAlign: 'center',
							fontSize: 18,
							bolder: true,
							breakWord: true,
							content: this.landladyInfo.userName + '邀请您体验收租鸟',
							color: '#333333',
							MaxLineNumber: 2
						},
					]
				};
				this.postersData = config;
			},
			onSuccessCreatePosters(res) {
				console.log(res.path);
				this.tempPath = res.path;
				this.$store.commit('shareImgPath', res.path)
				this.saveImg()
			},
			onPostersError(res) {
				console.log('错误', res)
			}
		}
	}
</script>

<style scoped>
	.shareFriend {
		width: 100%;
		min-height: 100vh;
		height: 100%;
		background-color: #FAFAFA;
	}

	.bannerImg {
		width: 100%;
		height: 370rpx;
	}

	.content {
		width: 694rpx;
		height: calc(100vh - 316rpx);
		position: absolute;
		top: 286rpx;
		left: 28rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx 20rpx 0 50rpx;
	}

	.titleBar {
		position: relative;
		height: fit-content;
		color: #333333;
		font-size: 34rpx;
		font-size: bold;
	}

	.titleBar::after {
		content: '';
		width: 8rpx;
		height: 32rpx;
		background-color: #FFA044;
		position: absolute;
		top: 50%;
		left: -22rpx;
		transform: translateY(-50%);
	}

	.actDate {
		font-size: 34rpx;
		margin-top: 60rpx;
	}

	.detail {
		font-size: 30rpx;
		color: #999999;
		margin-top: 20rpx;
	}

	.btnBox {
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		height: 80rpx;
		position: absolute;
		bottom: 87rpx;
		left: 0;
		display: flex;
		justify-content: space-between;
	}

	.setImg,
	.shareBtn {
		font-size: 30rpx;
		font-weight: bold;
		line-height: 76rpx;
		text-align: center;
	}

	.setImg {
		width: 296rpx;
		height: 100%;
		border: 2rpx solid #FFA044;
		color: #FFA044;
		border-radius: 40rpx;
	}

	.shareBtn {
		width: 296rpx;
		height: 100%;
		background-color: #FFA044;
		color: #FFFFFF;
		border-radius: 40rpx;
	}
	canvas {
		width: 750rpx;
		height: 1274rpx;
		position: fixed;
		top: 5000rpx;
		left: 0;
		z-index: -1;
	}
</style>
