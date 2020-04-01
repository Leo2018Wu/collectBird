<template>
	<view class="officalAccout">
		<view class="section"></view>
		<view class="content" :class="{shareHeight:fromShare}">
			<image class="divideBar" src="../../static/reportFormDivide.png" mode="aspectFit"></image>
			<view class="miniDes" v-if="fromShare">
				墙裂建议关注收租鸟服务号，以便及时接受账单、提醒和其他优惠。
			</view>
			<view class="miniDes" v-else>邀请租客通过扫码关注收租鸟公众号可以给租客发送账单，一键催租</view>
			<view class="qrCodeBox">
				<view class="inner">
					<image v-if="tempUrl.length !=0" @click="previewImage()" class="qrUrl" :src="tempUrl[0]" mode="aspectFit"></image>
				</view>
				<canvas canvas-id="myCanvas"></canvas>
				<!-- 	<view class="imgBox">
					<view class="border-radius1"></view>
					<view class="border-radius2"></view>
					<view class="border-radius3"></view>
					<view class="border-radius4"></view>
				</view> -->
				<view class="tip" v-if="!fromShare">点击二维码，然后长按发送图片</view>
			</view>
			
		</view>
		<view v-if="fromShare" class="shareBtn" @click="saveImg">保存图片</view>
		<button v-else class="shareBtn" open-type="share" hover-class="btnHoverClass">直接分享给租客</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fromShare:'',
				init: false,
				tempUrl: [],
				tenantId: "",
				ctx: {},
				bgUrl: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/bindBg.jpg',
				QrCodeUrl: ''
			}
		},
		onLoad(options) {
			console.log(options)
			this.tenantId = options.tenantId
			if(options.fromShare){
				this.fromShare = options.fromShare
			}
			console.log(typeof this.fromShare)
			this.getQrCode(this.tenantId)
			uni.showLoading({
				title: '加载中...'
			})

		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.landladyInfo.userName + '邀请您关注收租鸟公众号',
				imageUrl:'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/bindShare.jpg',
				// imageUrl: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/share1.jpg',
				path: '/pages/inviteBindOffical/inviteBindOffical?tenantId=' + this.tenantId+'&fromShare='+true
			}
		},
		methods: {
			saveImg(){
				let _this = this;
				uni.saveImageToPhotosAlbum({
					filePath: _this.tempUrl[0],
					success: function() {
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
					}
				});
			},
			drawImage() {
				let _this = this;
				_this.ctx = uni.createCanvasContext('myCanvas')

				_this.getImageInfo(_this.bgUrl).then(imgInfo => {
					console.log(imgInfo, 2321312312)
					_this.ctx.save()
					_this.ctx.setFillStyle('#FFFFFF')
					_this.ctx.fillRect(0, 0, 363, 152)
					_this.ctx.restore()
					_this.ctx.drawImage(imgInfo.localPath, 10,10, 323, 132)
					_this.getImageInfo(_this.QrCodeUrl).then(res => {
						_this.ctx.drawImage(res.localPath, 19, 19, 114, 114);
						// _this.ctx.setFontSize(15)
						// _this.ctx.setTextAlign('center')
						// _this.ctx.fillText('点击二维码，然后长按发送图片', 363/2, 186)
						_this.ctx.draw(true, () => {
							uni.hideLoading()
							_this.saveImageToLocal()
						});
					})
				})
			},
			saveImageToLocal() {
				let _this = this
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: 343,
					height: 425,
					canvasId: 'myCanvas',
					success: res => {
						if (res.errMsg === 'canvasToTempFilePath:ok') {
							console.log(res.tempFilePath)
							_this.tempUrl.push(res.tempFilePath)
							_this.init = true;
						}
					},
					fail(err) {
						console.log(err)
					},

				}, this);
			},
			getQrCode(tenantId) {
				this.$request.post('/wx/createQrcode', {
					tenantId
				}).then((res) => {
					console.log(res)
					this.QrCodeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.data.ticket;
					this.drawImage()
				})
			},
			getImageInfo(url) {
				console.log(url)
				let _this = this;
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
			previewImage() {
				// 预览图片
				console.log('你好')
				let _this = this;
				uni.previewImage({
					urls: _this.tempUrl,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.officalAccout {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
	}

	.section {
		width: 100%;
		height: 276rpx;
		position: relative;
		background: linear-gradient(-45deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 82%);
	}

	.content {
		width: 686rpx;
		padding-top: 66rpx;
		min-height: 760rpx;
		border-radius: 30rpx;
		position: absolute;
		top: 56rpx;
		left: 32rpx;
		background-color: #FFFFFF;
	}

	.divideBar {
		width: 100%;
		height: 20rpx;
		position: absolute;
		top: 242rpx;
		left: 0;
	}

	.miniDes {
		width: 100%;
		color: #333333;
		font-size: 36rpx;
		padding: 0 56rpx;
		line-height: 60rpx;
	}

	.qrCodeBox {
		width: 100%;
		height: fit-content;
		margin-top: 150rpx;
		padding: 0 30rpx;
	}

	.inner {
		width: 100%;
		height: 284rpx;
		position: relative;
	}

	.inner image {
		width: 100%;
		height: 100%;
	}


	.imgBox {
		width: 264rpx;
		height: 264rpx;
		border: 2rpx solid #070707;
		border-radius: 26rpx;
		position: relative;
	}

	.border-radius1 {
		width: 224rpx;
		height: 4rpx;
		position: absolute;
		top: -2rpx;
		left: 20rpx;
		background-color: #FFFFFF;
	}

	.border-radius2 {
		height: 224rpx;
		width: 4rpx;
		position: absolute;
		right: -2rpx;
		top: 20rpx;
		background-color: #FFFFFF;
	}

	.border-radius3 {
		height: 224rpx;
		width: 4rpx;
		position: absolute;
		left: -2rpx;
		top: 20rpx;
		background-color: #FFFFFF;
	}

	.border-radius4 {
		width: 224rpx;
		height: 4rpx;
		position: absolute;
		bottom: -2rpx;
		left: 20rpx;
		background-color: #FFFFFF;
	}

	.tip {
		width: 100%;
		margin-top: 46rpx;
		color: #999999;
		font-size: 30rpx;
		text-align: center;
	}

	.shareBtn {
		width: 570rpx;
		height: 86rpx;
		text-align: center;
		line-height: 86rpx;
		background: linear-gradient(-90deg, rgba(240, 154, 66, 1) 0%, rgba(243, 183, 73, 1) 100%);
		border-radius: 43rpx;
		color: #FFFFFF;
		font-size: 40rpx;
		position: fixed;
		left: 90rpx;
		bottom: 160rpx;
	}
	
	.shareHeight{
		min-height: 680rpx !important;
	}
	canvas {
		width: 726rpx;
		height: 304rpx;
		position: fixed;
		top: 5000rpx;
		left: 0;
		z-index: -1;
	}
</style>
